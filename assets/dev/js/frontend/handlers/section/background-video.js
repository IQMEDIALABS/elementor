export default class BackgroundVideo extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				backgroundVideoContainer: '.elementor-background-video-container',
				backgroundVideoEmbed: '.elementor-background-video-embed',
				backgroundVideoHosted: '.elementor-background-video-hosted',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' ),
			elements = {
				$backgroundVideoContainer: this.$element.find( selectors.backgroundVideoContainer ),
			};

		elements.$backgroundVideoEmbed = elements.$backgroundVideoContainer.children( selectors.backgroundVideoEmbed );

		elements.$backgroundVideoHosted = elements.$backgroundVideoContainer.children( selectors.backgroundVideoHosted );

		return elements;
	}

	calcVideosSize( $video ) {
		let aspectRatioSetting;

		if ( this.isVimeoVideo ) {
			aspectRatioSetting = $video ? $video.outerWidth() + ':' + $video.outerHeight() : '16:9';
		} else {
			aspectRatioSetting = '16:9';
		}

		const containerWidth = this.elements.$backgroundVideoContainer.outerWidth(),
			containerHeight = this.elements.$backgroundVideoContainer.outerHeight(),
			aspectRatioArray = aspectRatioSetting.split( ':' ),
			aspectRatio = aspectRatioArray[ 0 ] / aspectRatioArray[ 1 ],
			ratioWidth = containerWidth / aspectRatio,
			ratioHeight = containerHeight * aspectRatio,
			isWidthFixed = containerWidth / containerHeight > aspectRatio;

		return {
			width: isWidthFixed ? containerWidth : ratioHeight,
			height: isWidthFixed ? ratioWidth : containerHeight,
		};
	}

	changeVideoSize() {
		if ( ! this.isHostedVideo && ! this.player ) {
			return;
		}

		let $video;

		if ( this.isYTVideo ) {
			$video = jQuery( this.player.getIframe() );
		} else if ( this.isVimeoVideo ) {
			$video = jQuery( this.player.element );
		} else if ( this.isHostedVideo ) {
			$video = this.elements.$backgroundVideoHosted;
		}

		const size = this.calcVideosSize( $video );

		$video.width( size.width ).height( size.height );
	}

	startVideoLoop( firstTime ) {
		// If the section has been removed
		if ( ! this.player.getIframe().contentWindow ) {
			return;
		}

		const elementSettings = this.getElementSettings(),
			startPoint = elementSettings.background_video_start || 0,
			endPoint = elementSettings.background_video_end;

		if ( elementSettings.background_play_once && ! firstTime ) {
			this.player.stopVideo();
			return;
		}

		this.player.seekTo( startPoint );

		if ( endPoint ) {
			const durationToEnd = endPoint - startPoint + 1;

			setTimeout( () => {
				this.startVideoLoop( false );
			}, durationToEnd * 1000 );
		}
	}

	prepareVimeoVideo( Vimeo, videoId ) {
		const elementSettings = this.getElementSettings(),
			startTime = elementSettings.background_video_start ? elementSettings.background_video_start : 0,
			videoSize = this.calcVideosSize(),
			vimeoOptions = {
				id: videoId,
				width: videoSize.width,
				background: true,
				loop: ! elementSettings.background_play_once,
				transparent: false,
				playsinline: false,
			};

		this.player = new Vimeo.Player( this.elements.$backgroundVideoContainer, vimeoOptions );

		// Handle user-defined start/end times
		this.handleVimeoStartEndTimes( elementSettings, startTime );

		this.player.ready().then( () => {
			jQuery( this.player.element ).addClass( 'elementor-background-video-embed' );
			this.changeVideoSize();
		} );
	}

	handleVimeoStartEndTimes( elementSettings, startTime ) {
		// If a start time is defined, set the start time
		if ( startTime ) {
			this.player.on( 'play', ( data ) => {
				if ( 0 === data.seconds ) {
					this.player.setCurrentTime( startTime );
				}
			} );
		}

		// If an end time is defined, handle ending the video
		this.player.on( 'timeupdate', ( data ) => {
			if ( elementSettings.background_video_end && elementSettings.background_video_end < data.seconds ) {
				if ( elementSettings.background_play_once ) {
					// Stop at user-defined end time if not loop
					this.player.pause();
				} else {
					// Go to start time if loop
					this.player.setCurrentTime( startTime );
				}
			}

			// If start time is defined but an end time is not, go to user-defined start time at video end.
			// Vimeo JS API has an 'ended' event, but it never fires when infinite loop is defined, so we
			// get the video duration (returns a promise) then use duration-0.5s as end time
			this.player.getDuration().then( ( duration ) => {
				if ( startTime && ! elementSettings.background_video_end && data.seconds > duration - 0.5 ) {
					this.player.setCurrentTime( startTime );
				}
			} );
		} );
	}

	prepareYTVideo( YT, videoID ) {
		const $backgroundVideoContainer = this.elements.$backgroundVideoContainer,
			elementSettings = this.getElementSettings();
		let startStateCode = YT.PlayerState.PLAYING;

		// Since version 67, Chrome doesn't fire the `PLAYING` state at start time
		if ( window.chrome ) {
			startStateCode = YT.PlayerState.UNSTARTED;
		}

		$backgroundVideoContainer.addClass( 'elementor-loading elementor-invisible' );

		this.player = new YT.Player( this.elements.$backgroundVideoEmbed[ 0 ], {
			videoId: videoID,
			events: {
				onReady: () => {
					this.player.mute();

					this.changeVideoSize();

					this.startVideoLoop( true );

					this.player.playVideo();
				},
				onStateChange: ( event ) => {
					switch ( event.data ) {
						case startStateCode:
							$backgroundVideoContainer.removeClass( 'elementor-invisible elementor-loading' );

							break;
						case YT.PlayerState.ENDED:
							this.player.seekTo( elementSettings.background_video_start || 0 );
							if ( elementSettings.background_play_once ) {
								this.player.destroy();
							}
					}
				},
			},
			playerVars: {
				controls: 0,
				rel: 0,
			},
		} );
	}

	activate() {
		let videoLink = this.getElementSettings( 'background_video_link' ),
			videoID;

		const playOnce = this.getElementSettings( 'background_play_once' );

		if ( -1 !== videoLink.indexOf( 'vimeo.com' ) ) {
			this.isVimeoVideo = true;
			this.apiProvider = elementorFrontend.utils.vimeo;
		} else {
			this.isYTVideo = true;
			this.apiProvider = elementorFrontend.utils.youtube;
		}

		if ( this.apiProvider ) {
			videoID = this.apiProvider.getVideoIDFromURL( videoLink );
		}

		if ( this.apiProvider ) {
			this.apiProvider.onApiReady( ( apiObject ) => {
				if ( this.isYTVideo ) {
					this.prepareYTVideo( apiObject, videoID );
				}

				if ( this.isVimeoVideo ) {
					this.prepareVimeoVideo( apiObject, videoID );
				}
			} );
		} else {
			this.isHostedVideo = true;

			const startTime = this.getElementSettings( 'background_video_start' ),
				endTime = this.getElementSettings( 'background_video_end' );
			if ( startTime || endTime ) {
				videoLink += '#t=' + ( startTime || 0 ) + ( endTime ? ',' + endTime : '' );
			}
			this.elements.$backgroundVideoHosted.attr( 'src', videoLink ).one( 'canplay', this.changeVideoSize.bind( this ) );
			if ( playOnce ) {
				this.elements.$backgroundVideoHosted.on( 'ended', () => {
					this.elements.$backgroundVideoHosted.hide();
				} );
			}
		}

		elementorFrontend.elements.$window.on( 'resize', this.changeVideoSize );
	}

	deactivate() {
		if ( ( this.isYTVideo && this.player.getIframe() ) || this.isVimeoVideo ) {
			this.player.destroy();
		} else {
			this.elements.$backgroundVideoHosted.removeAttr( 'src' ).off( 'ended' );
		}

		elementorFrontend.elements.$window.off( 'resize', this.changeVideoSize );
	}

	run() {
		const elementSettings = this.getElementSettings();

		if ( 'video' === elementSettings.background_background && elementSettings.background_video_link ) {
			this.activate();
		} else {
			this.deactivate();
		}
	}

	onInit( ...args ) {
		super.onInit( ...args );

		this.changeVideoSize = this.changeVideoSize.bind( this );

		this.run();
	}

	onElementChange( propertyName ) {
		if ( 'background_background' === propertyName ) {
			this.run();
		}
	}
}
