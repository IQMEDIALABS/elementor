<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor fonts.
 *
 * Elementor fonts handler class is responsible for registering the supported
 * fonts used by Elementor.
 *
 * @since 1.0.0
 */
class Fonts {

	/**
	 * The system font name.
	 */
	const SYSTEM = 'system';

	/**
	 * The google font name.
	 */
	const GOOGLE = 'googlefonts';

	/**
	 * The google early access font name.
	 */
	const EARLYACCESS = 'earlyaccess';

	/**
	 * The local font name.
	 */
	const LOCAL = 'local';

	private static $fonts;

	/**
	 * Font groups.
	 *
	 * Used to hold font types/groups.
	 *
	 * @since 1.9.4
	 * @access private
	 * @static
	 *
	 * @var null|array
	 */
	private static $font_groups;

	/**
	 * Get font Groups.
	 *
	 * Retrieve the list of font groups.
	 *
	 * @since 1.9.4
	 * @access public
	 * @static
	 *
	 * @return array Supported font groups/types.
	 */
	public static function get_font_groups() {
		if ( null === self::$font_groups ) {
			$font_groups = [
				self::SYSTEM => esc_html__( 'System', 'elementor' ),
				self::GOOGLE => esc_html__( 'Google', 'elementor' ),
				self::EARLYACCESS => esc_html__( 'Google Early Access', 'elementor' ),
			];

			/**
			 * Font groups.
			 *
			 * Filters the fonts groups used by Elementor.
			 *
			 * @since 1.9.4
			 *
			 * @param array $font_groups Font groups.
			 */
			$font_groups = apply_filters( 'elementor/fonts/groups', $font_groups );

			self::$font_groups = $font_groups;
		}

		return self::$font_groups;
	}

	/**
	 * Get fonts.
	 *
	 * Retrieve the list of supported fonts.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return array Supported fonts.
	 */
	public static function get_fonts() {
		if ( null === self::$fonts ) {
			$additional_fonts = [];

			/**
			 * Additional fonts.
			 *
			 * Filters the fonts used by Elementor to add additional fonts.
			 *
			 * @since 1.9.4
			 *
			 * @param array $additional_fonts Additional Elementor fonts.
			 */
			$additional_fonts = apply_filters( 'elementor/fonts/additional_fonts', $additional_fonts );

			self::$fonts = array_merge( self::get_native_fonts(), $additional_fonts );
		}

		return self::$fonts;
	}

	/**
	 * Get Elementor native fonts.
	 *
	 * Retrieve the list of supported fonts.
	 *
	 * @since 1.9.4
	 * @access private
	 * @static
	 *
	 * @return array Supported fonts.
	 */
	private static function get_native_fonts() {
		return [
			// System fonts.
			'Arial' => self::SYSTEM,
			'Tahoma' => self::SYSTEM,
			'Verdana' => self::SYSTEM,
			'Helvetica' => self::SYSTEM,
			'Times New Roman' => self::SYSTEM,
			'Trebuchet MS' => self::SYSTEM,
			'Georgia' => self::SYSTEM,

			// Google Fonts (last update: 07/05/2021).
			'ABeeZee' => self::GOOGLE,
			'Abel' => self::GOOGLE,
			'Abhaya Libre' => self::GOOGLE,
			'Abril Fatface' => self::GOOGLE,
			'Aclonica' => self::GOOGLE,
			'Acme' => self::GOOGLE,
			'Actor' => self::GOOGLE,
			'Adamina' => self::GOOGLE,
			'Advent Pro' => self::GOOGLE,
			'Aguafina Script' => self::GOOGLE,
			'Akaya Kanadaka' => self::GOOGLE,
			'Akaya Telivigala' => self::GOOGLE,
			'Akronim' => self::GOOGLE,
			'Aladin' => self::GOOGLE,
			'Alata' => self::GOOGLE,
			'Alatsi' => self::GOOGLE,
			'Aldrich' => self::GOOGLE,
			'Alef' => self::GOOGLE,
			'Alef Hebrew' => self::EARLYACCESS, // Hack for Google Early Access.
			'Alegreya' => self::GOOGLE,
			'Alegreya SC' => self::GOOGLE,
			'Alegreya Sans' => self::GOOGLE,
			'Alegreya Sans SC' => self::GOOGLE,
			'Aleo' => self::GOOGLE,
			'Alex Brush' => self::GOOGLE,
			'Alfa Slab One' => self::GOOGLE,
			'Alice' => self::GOOGLE,
			'Alike' => self::GOOGLE,
			'Alike Angular' => self::GOOGLE,
			'Allan' => self::GOOGLE,
			'Allerta' => self::GOOGLE,
			'Allerta Stencil' => self::GOOGLE,
			'Allura' => self::GOOGLE,
			'Almarai' => self::GOOGLE,
			'Almendra' => self::GOOGLE,
			'Almendra Display' => self::GOOGLE,
			'Almendra SC' => self::GOOGLE,
			'Amarante' => self::GOOGLE,
			'Amaranth' => self::GOOGLE,
			'Amatic SC' => self::GOOGLE,
			'Amethysta' => self::GOOGLE,
			'Amiko' => self::GOOGLE,
			'Amiri' => self::GOOGLE,
			'Amita' => self::GOOGLE,
			'Anaheim' => self::GOOGLE,
			'Andada' => self::GOOGLE,
			'Andika' => self::GOOGLE,
			'Andika New Basic' => self::GOOGLE,
			'Angkor' => self::GOOGLE,
			'Annie Use Your Telescope' => self::GOOGLE,
			'Anonymous Pro' => self::GOOGLE,
			'Antic' => self::GOOGLE,
			'Antic Didone' => self::GOOGLE,
			'Antic Slab' => self::GOOGLE,
			'Anton' => self::GOOGLE,
			'Antonio' => self::GOOGLE,
			'Arapey' => self::GOOGLE,
			'Arbutus' => self::GOOGLE,
			'Arbutus Slab' => self::GOOGLE,
			'Architects Daughter' => self::GOOGLE,
			'Archivo' => self::GOOGLE,
			'Archivo Black' => self::GOOGLE,
			'Archivo Narrow' => self::GOOGLE,
			'Aref Ruqaa' => self::GOOGLE,
			'Arima Madurai' => self::GOOGLE,
			'Arimo' => self::GOOGLE,
			'Arizonia' => self::GOOGLE,
			'Armata' => self::GOOGLE,
			'Arsenal' => self::GOOGLE,
			'Artifika' => self::GOOGLE,
			'Arvo' => self::GOOGLE,
			'Arya' => self::GOOGLE,
			'Asap' => self::GOOGLE,
			'Asap Condensed' => self::GOOGLE,
			'Asar' => self::GOOGLE,
			'Asset' => self::GOOGLE,
			'Assistant' => self::GOOGLE,
			'Astloch' => self::GOOGLE,
			'Asul' => self::GOOGLE,
			'Athiti' => self::GOOGLE,
			'Atma' => self::GOOGLE,
			'Atomic Age' => self::GOOGLE,
			'Aubrey' => self::GOOGLE,
			'Audiowide' => self::GOOGLE,
			'Autour One' => self::GOOGLE,
			'Average' => self::GOOGLE,
			'Average Sans' => self::GOOGLE,
			'Averia Gruesa Libre' => self::GOOGLE,
			'Averia Libre' => self::GOOGLE,
			'Averia Sans Libre' => self::GOOGLE,
			'Averia Serif Libre' => self::GOOGLE,
			'B612' => self::GOOGLE,
			'B612 Mono' => self::GOOGLE,
			'Bad Script' => self::GOOGLE,
			'Bahiana' => self::GOOGLE,
			'Bahianita' => self::GOOGLE,
			'Bai Jamjuree' => self::GOOGLE,
			'Ballet' => self::GOOGLE,
			'Baloo 2' => self::GOOGLE,
			'Baloo Bhai 2' => self::GOOGLE,
			'Baloo Bhaina 2' => self::GOOGLE,
			'Baloo Chettan 2' => self::GOOGLE,
			'Baloo Da 2' => self::GOOGLE,
			'Baloo Paaji 2' => self::GOOGLE,
			'Baloo Tamma 2' => self::GOOGLE,
			'Baloo Tammudu 2' => self::GOOGLE,
			'Baloo Thambi 2' => self::GOOGLE,
			'Balsamiq Sans' => self::GOOGLE,
			'Balthazar' => self::GOOGLE,
			'Bangers' => self::GOOGLE,
			'Barlow' => self::GOOGLE,
			'Barlow Condensed' => self::GOOGLE,
			'Barlow Semi Condensed' => self::GOOGLE,
			'Barriecito' => self::GOOGLE,
			'Barrio' => self::GOOGLE,
			'Basic' => self::GOOGLE,
			'Baskervville' => self::GOOGLE,
			'Battambang' => self::GOOGLE,
			'Baumans' => self::GOOGLE,
			'Bayon' => self::GOOGLE,
			'Be Vietnam' => self::GOOGLE,
			'Bebas Neue' => self::GOOGLE,
			'Belgrano' => self::GOOGLE,
			'Bellefair' => self::GOOGLE,
			'Belleza' => self::GOOGLE,
			'Bellota' => self::GOOGLE,
			'Bellota Text' => self::GOOGLE,
			'BenchNine' => self::GOOGLE,
			'Benne' => self::GOOGLE,
			'Bentham' => self::GOOGLE,
			'Berkshire Swash' => self::GOOGLE,
			'Beth Ellen' => self::GOOGLE,
			'Bevan' => self::GOOGLE,
			'Big Shoulders Display' => self::GOOGLE,
			'Big Shoulders Inline Display' => self::GOOGLE,
			'Big Shoulders Inline Text' => self::GOOGLE,
			'Big Shoulders Stencil Display' => self::GOOGLE,
			'Big Shoulders Stencil Text' => self::GOOGLE,
			'Big Shoulders Text' => self::GOOGLE,
			'Bigelow Rules' => self::GOOGLE,
			'Bigshot One' => self::GOOGLE,
			'Bilbo' => self::GOOGLE,
			'Bilbo Swash Caps' => self::GOOGLE,
			'BioRhyme' => self::GOOGLE,
			'BioRhyme Expanded' => self::GOOGLE,
			'Biryani' => self::GOOGLE,
			'Bitter' => self::GOOGLE,
			'Black And White Picture' => self::GOOGLE,
			'Black Han Sans' => self::GOOGLE,
			'Black Ops One' => self::GOOGLE,
			'Blinker' => self::GOOGLE,
			'Bodoni Moda' => self::GOOGLE,
			'Bokor' => self::GOOGLE,
			'Bonbon' => self::GOOGLE,
			'Boogaloo' => self::GOOGLE,
			'Bowlby One' => self::GOOGLE,
			'Bowlby One SC' => self::GOOGLE,
			'Brawler' => self::GOOGLE,
			'Bree Serif' => self::GOOGLE,
			'Brygada 1918' => self::GOOGLE,
			'Bubblegum Sans' => self::GOOGLE,
			'Bubbler One' => self::GOOGLE,
			'Buda' => self::GOOGLE,
			'Buenard' => self::GOOGLE,
			'Bungee' => self::GOOGLE,
			'Bungee Hairline' => self::GOOGLE,
			'Bungee Inline' => self::GOOGLE,
			'Bungee Outline' => self::GOOGLE,
			'Bungee Shade' => self::GOOGLE,
			'Butcherman' => self::GOOGLE,
			'Butterfly Kids' => self::GOOGLE,
			'Cabin' => self::GOOGLE,
			'Cabin Condensed' => self::GOOGLE,
			'Cabin Sketch' => self::GOOGLE,
			'Caesar Dressing' => self::GOOGLE,
			'Cagliostro' => self::GOOGLE,
			'Cairo' => self::GOOGLE,
			'Caladea' => self::GOOGLE,
			'Calistoga' => self::GOOGLE,
			'Calligraffitti' => self::GOOGLE,
			'Cambay' => self::GOOGLE,
			'Cambo' => self::GOOGLE,
			'Candal' => self::GOOGLE,
			'Cantarell' => self::GOOGLE,
			'Cantata One' => self::GOOGLE,
			'Cantora One' => self::GOOGLE,
			'Capriola' => self::GOOGLE,
			'Cardo' => self::GOOGLE,
			'Carme' => self::GOOGLE,
			'Carrois Gothic' => self::GOOGLE,
			'Carrois Gothic SC' => self::GOOGLE,
			'Carter One' => self::GOOGLE,
			'Castoro' => self::GOOGLE,
			'Catamaran' => self::GOOGLE,
			'Caudex' => self::GOOGLE,
			'Caveat' => self::GOOGLE,
			'Caveat Brush' => self::GOOGLE,
			'Cedarville Cursive' => self::GOOGLE,
			'Ceviche One' => self::GOOGLE,
			'Chakra Petch' => self::GOOGLE,
			'Changa' => self::GOOGLE,
			'Changa One' => self::GOOGLE,
			'Chango' => self::GOOGLE,
			'Charm' => self::GOOGLE,
			'Charmonman' => self::GOOGLE,
			'Chathura' => self::GOOGLE,
			'Chau Philomene One' => self::GOOGLE,
			'Chela One' => self::GOOGLE,
			'Chelsea Market' => self::GOOGLE,
			'Chenla' => self::GOOGLE,
			'Cherry Cream Soda' => self::GOOGLE,
			'Cherry Swash' => self::GOOGLE,
			'Chewy' => self::GOOGLE,
			'Chicle' => self::GOOGLE,
			'Chilanka' => self::GOOGLE,
			'Chivo' => self::GOOGLE,
			'Chonburi' => self::GOOGLE,
			'Cinzel' => self::GOOGLE,
			'Cinzel Decorative' => self::GOOGLE,
			'Clicker Script' => self::GOOGLE,
			'Coda' => self::GOOGLE,
			'Coda Caption' => self::GOOGLE,
			'Codystar' => self::GOOGLE,
			'Coiny' => self::GOOGLE,
			'Combo' => self::GOOGLE,
			'Comfortaa' => self::GOOGLE,
			'Comic Neue' => self::GOOGLE,
			'Coming Soon' => self::GOOGLE,
			'Commissioner' => self::GOOGLE,
			'Concert One' => self::GOOGLE,
			'Condiment' => self::GOOGLE,
			'Content' => self::GOOGLE,
			'Contrail One' => self::GOOGLE,
			'Convergence' => self::GOOGLE,
			'Cookie' => self::GOOGLE,
			'Copse' => self::GOOGLE,
			'Corben' => self::GOOGLE,
			'Cormorant' => self::GOOGLE,
			'Cormorant Garamond' => self::GOOGLE,
			'Cormorant Infant' => self::GOOGLE,
			'Cormorant SC' => self::GOOGLE,
			'Cormorant Unicase' => self::GOOGLE,
			'Cormorant Upright' => self::GOOGLE,
			'Courgette' => self::GOOGLE,
			'Courier Prime' => self::GOOGLE,
			'Cousine' => self::GOOGLE,
			'Coustard' => self::GOOGLE,
			'Covered By Your Grace' => self::GOOGLE,
			'Crafty Girls' => self::GOOGLE,
			'Creepster' => self::GOOGLE,
			'Crete Round' => self::GOOGLE,
			'Crimson Pro' => self::GOOGLE,
			'Crimson Text' => self::GOOGLE,
			'Croissant One' => self::GOOGLE,
			'Crushed' => self::GOOGLE,
			'Cuprum' => self::GOOGLE,
			'Cute Font' => self::GOOGLE,
			'Cutive' => self::GOOGLE,
			'Cutive Mono' => self::GOOGLE,
			'DM Mono' => self::GOOGLE,
			'DM Sans' => self::GOOGLE,
			'DM Serif Display' => self::GOOGLE,
			'DM Serif Text' => self::GOOGLE,
			'Damion' => self::GOOGLE,
			'Dancing Script' => self::GOOGLE,
			'Dangrek' => self::GOOGLE,
			'Darker Grotesque' => self::GOOGLE,
			'David Libre' => self::GOOGLE,
			'Dawning of a New Day' => self::GOOGLE,
			'Days One' => self::GOOGLE,
			'Dekko' => self::GOOGLE,
			'Dela Gothic One' => self::GOOGLE,
			'Delius' => self::GOOGLE,
			'Delius Swash Caps' => self::GOOGLE,
			'Delius Unicase' => self::GOOGLE,
			'Della Respira' => self::GOOGLE,
			'Denk One' => self::GOOGLE,
			'Devonshire' => self::GOOGLE,
			'Dhurjati' => self::GOOGLE,
			'Didact Gothic' => self::GOOGLE,
			'Diplomata' => self::GOOGLE,
			'Diplomata SC' => self::GOOGLE,
			'Do Hyeon' => self::GOOGLE,
			'Dokdo' => self::GOOGLE,
			'Domine' => self::GOOGLE,
			'Donegal One' => self::GOOGLE,
			'Doppio One' => self::GOOGLE,
			'Dorsa' => self::GOOGLE,
			'Dosis' => self::GOOGLE,
			'DotGothic16' => self::GOOGLE,
			'Dr Sugiyama' => self::GOOGLE,
			'Droid Arabic Kufi' => self::EARLYACCESS, // Hack for Google Early Access.
			'Droid Arabic Naskh' => self::EARLYACCESS, // Hack for Google Early Access.
			'Duru Sans' => self::GOOGLE,
			'Dynalight' => self::GOOGLE,
			'EB Garamond' => self::GOOGLE,
			'Eagle Lake' => self::GOOGLE,
			'East Sea Dokdo' => self::GOOGLE,
			'Eater' => self::GOOGLE,
			'Economica' => self::GOOGLE,
			'Eczar' => self::GOOGLE,
			'El Messiri' => self::GOOGLE,
			'Electrolize' => self::GOOGLE,
			'Elsie' => self::GOOGLE,
			'Elsie Swash Caps' => self::GOOGLE,
			'Emblema One' => self::GOOGLE,
			'Emilys Candy' => self::GOOGLE,
			'Encode Sans' => self::GOOGLE,
			'Encode Sans Condensed' => self::GOOGLE,
			'Encode Sans Expanded' => self::GOOGLE,
			'Encode Sans Semi Condensed' => self::GOOGLE,
			'Encode Sans Semi Expanded' => self::GOOGLE,
			'Engagement' => self::GOOGLE,
			'Englebert' => self::GOOGLE,
			'Enriqueta' => self::GOOGLE,
			'Epilogue' => self::GOOGLE,
			'Erica One' => self::GOOGLE,
			'Esteban' => self::GOOGLE,
			'Euphoria Script' => self::GOOGLE,
			'Ewert' => self::GOOGLE,
			'Exo' => self::GOOGLE,
			'Exo 2' => self::GOOGLE,
			'Expletus Sans' => self::GOOGLE,
			'Fahkwang' => self::GOOGLE,
			'Fanwood Text' => self::GOOGLE,
			'Farro' => self::GOOGLE,
			'Farsan' => self::GOOGLE,
			'Fascinate' => self::GOOGLE,
			'Fascinate Inline' => self::GOOGLE,
			'Faster One' => self::GOOGLE,
			'Fasthand' => self::GOOGLE,
			'Fauna One' => self::GOOGLE,
			'Faustina' => self::GOOGLE,
			'Federant' => self::GOOGLE,
			'Federo' => self::GOOGLE,
			'Felipa' => self::GOOGLE,
			'Fenix' => self::GOOGLE,
			'Finger Paint' => self::GOOGLE,
			'Fira Code' => self::GOOGLE,
			'Fira Mono' => self::GOOGLE,
			'Fira Sans' => self::GOOGLE,
			'Fira Sans Condensed' => self::GOOGLE,
			'Fira Sans Extra Condensed' => self::GOOGLE,
			'Fjalla One' => self::GOOGLE,
			'Fjord One' => self::GOOGLE,
			'Flamenco' => self::GOOGLE,
			'Flavors' => self::GOOGLE,
			'Fondamento' => self::GOOGLE,
			'Fontdiner Swanky' => self::GOOGLE,
			'Forum' => self::GOOGLE,
			'Francois One' => self::GOOGLE,
			'Frank Ruhl Libre' => self::GOOGLE,
			'Fraunces' => self::GOOGLE,
			'Freckle Face' => self::GOOGLE,
			'Fredericka the Great' => self::GOOGLE,
			'Fredoka One' => self::GOOGLE,
			'Freehand' => self::GOOGLE,
			'Fresca' => self::GOOGLE,
			'Frijole' => self::GOOGLE,
			'Fruktur' => self::GOOGLE,
			'Fugaz One' => self::GOOGLE,
			'GFS Didot' => self::GOOGLE,
			'GFS Neohellenic' => self::GOOGLE,
			'Gabriela' => self::GOOGLE,
			'Gaegu' => self::GOOGLE,
			'Gafata' => self::GOOGLE,
			'Galada' => self::GOOGLE,
			'Galdeano' => self::GOOGLE,
			'Galindo' => self::GOOGLE,
			'Gamja Flower' => self::GOOGLE,
			'Gayathri' => self::GOOGLE,
			'Gelasio' => self::GOOGLE,
			'Gentium Basic' => self::GOOGLE,
			'Gentium Book Basic' => self::GOOGLE,
			'Geo' => self::GOOGLE,
			'Geostar' => self::GOOGLE,
			'Geostar Fill' => self::GOOGLE,
			'Germania One' => self::GOOGLE,
			'Gidugu' => self::GOOGLE,
			'Gilda Display' => self::GOOGLE,
			'Girassol' => self::GOOGLE,
			'Give You Glory' => self::GOOGLE,
			'Glass Antiqua' => self::GOOGLE,
			'Glegoo' => self::GOOGLE,
			'Gloria Hallelujah' => self::GOOGLE,
			'Goblin One' => self::GOOGLE,
			'Gochi Hand' => self::GOOGLE,
			'Goldman' => self::GOOGLE,
			'Gorditas' => self::GOOGLE,
			'Gothic A1' => self::GOOGLE,
			'Gotu' => self::GOOGLE,
			'Goudy Bookletter 1911' => self::GOOGLE,
			'Graduate' => self::GOOGLE,
			'Grand Hotel' => self::GOOGLE,
			'Grandstander' => self::GOOGLE,
			'Gravitas One' => self::GOOGLE,
			'Great Vibes' => self::GOOGLE,
			'Grenze' => self::GOOGLE,
			'Grenze Gotisch' => self::GOOGLE,
			'Griffy' => self::GOOGLE,
			'Gruppo' => self::GOOGLE,
			'Gudea' => self::GOOGLE,
			'Gugi' => self::GOOGLE,
			'Gupter' => self::GOOGLE,
			'Gurajada' => self::GOOGLE,
			'Habibi' => self::GOOGLE,
			'Hachi Maru Pop' => self::GOOGLE,
			'Halant' => self::GOOGLE,
			'Hammersmith One' => self::GOOGLE,
			'Hanalei' => self::GOOGLE,
			'Hanalei Fill' => self::GOOGLE,
			'Handlee' => self::GOOGLE,
			'Hanuman' => self::GOOGLE,
			'Happy Monkey' => self::GOOGLE,
			'Harmattan' => self::GOOGLE,
			'Headland One' => self::GOOGLE,
			'Heebo' => self::GOOGLE,
			'Henny Penny' => self::GOOGLE,
			'Hepta Slab' => self::GOOGLE,
			'Herr Von Muellerhoff' => self::GOOGLE,
			'Hi Melody' => self::GOOGLE,
			'Hind' => self::GOOGLE,
			'Hind Guntur' => self::GOOGLE,
			'Hind Madurai' => self::GOOGLE,
			'Hind Siliguri' => self::GOOGLE,
			'Hind Vadodara' => self::GOOGLE,
			'Holtwood One SC' => self::GOOGLE,
			'Homemade Apple' => self::GOOGLE,
			'Homenaje' => self::GOOGLE,
			'IBM Plex Mono' => self::GOOGLE,
			'IBM Plex Sans' => self::GOOGLE,
			'IBM Plex Sans Condensed' => self::GOOGLE,
			'IBM Plex Serif' => self::GOOGLE,
			'IM Fell DW Pica' => self::GOOGLE,
			'IM Fell DW Pica SC' => self::GOOGLE,
			'IM Fell Double Pica' => self::GOOGLE,
			'IM Fell Double Pica SC' => self::GOOGLE,
			'IM Fell English' => self::GOOGLE,
			'IM Fell English SC' => self::GOOGLE,
			'IM Fell French Canon' => self::GOOGLE,
			'IM Fell French Canon SC' => self::GOOGLE,
			'IM Fell Great Primer' => self::GOOGLE,
			'IM Fell Great Primer SC' => self::GOOGLE,
			'Ibarra Real Nova' => self::GOOGLE,
			'Iceberg' => self::GOOGLE,
			'Iceland' => self::GOOGLE,
			'Imbue' => self::GOOGLE,
			'Imprima' => self::GOOGLE,
			'Inconsolata' => self::GOOGLE,
			'Inder' => self::GOOGLE,
			'Indie Flower' => self::GOOGLE,
			'Inika' => self::GOOGLE,
			'Inknut Antiqua' => self::GOOGLE,
			'Inria Sans' => self::GOOGLE,
			'Inria Serif' => self::GOOGLE,
			'Inter' => self::GOOGLE,
			'Irish Grover' => self::GOOGLE,
			'Istok Web' => self::GOOGLE,
			'Italiana' => self::GOOGLE,
			'Italianno' => self::GOOGLE,
			'Itim' => self::GOOGLE,
			'Jacques Francois' => self::GOOGLE,
			'Jacques Francois Shadow' => self::GOOGLE,
			'Jaldi' => self::GOOGLE,
			'JetBrains Mono' => self::GOOGLE,
			'Jim Nightshade' => self::GOOGLE,
			'Jockey One' => self::GOOGLE,
			'Jolly Lodger' => self::GOOGLE,
			'Jomhuria' => self::GOOGLE,
			'Jomolhari' => self::GOOGLE,
			'Josefin Sans' => self::GOOGLE,
			'Josefin Slab' => self::GOOGLE,
			'Jost' => self::GOOGLE,
			'Joti One' => self::GOOGLE,
			'Jua' => self::GOOGLE,
			'Judson' => self::GOOGLE,
			'Julee' => self::GOOGLE,
			'Julius Sans One' => self::GOOGLE,
			'Junge' => self::GOOGLE,
			'Jura' => self::GOOGLE,
			'Just Another Hand' => self::GOOGLE,
			'Just Me Again Down Here' => self::GOOGLE,
			'K2D' => self::GOOGLE,
			'Kadwa' => self::GOOGLE,
			'Kalam' => self::GOOGLE,
			'Kameron' => self::GOOGLE,
			'Kanit' => self::GOOGLE,
			'Kantumruy' => self::GOOGLE,
			'Karantina' => self::GOOGLE,
			'Karla' => self::GOOGLE,
			'Karma' => self::GOOGLE,
			'Katibeh' => self::GOOGLE,
			'Kaushan Script' => self::GOOGLE,
			'Kavivanar' => self::GOOGLE,
			'Kavoon' => self::GOOGLE,
			'Kdam Thmor' => self::GOOGLE,
			'Keania One' => self::GOOGLE,
			'Kelly Slab' => self::GOOGLE,
			'Kenia' => self::GOOGLE,
			'Khand' => self::GOOGLE,
			'Khmer' => self::GOOGLE,
			'Khula' => self::GOOGLE,
			'Kirang Haerang' => self::GOOGLE,
			'Kite One' => self::GOOGLE,
			'Kiwi Maru' => self::GOOGLE,
			'Knewave' => self::GOOGLE,
			'KoHo' => self::GOOGLE,
			'Kodchasan' => self::GOOGLE,
			'Kosugi' => self::GOOGLE,
			'Kosugi Maru' => self::GOOGLE,
			'Kotta One' => self::GOOGLE,
			'Koulen' => self::GOOGLE,
			'Kranky' => self::GOOGLE,
			'Kreon' => self::GOOGLE,
			'Kristi' => self::GOOGLE,
			'Krona One' => self::GOOGLE,
			'Krub' => self::GOOGLE,
			'Kufam' => self::GOOGLE,
			'Kulim Park' => self::GOOGLE,
			'Kumar One' => self::GOOGLE,
			'Kumar One Outline' => self::GOOGLE,
			'Kumbh Sans' => self::GOOGLE,
			'Kurale' => self::GOOGLE,
			'La Belle Aurore' => self::GOOGLE,
			'Lacquer' => self::GOOGLE,
			'Laila' => self::GOOGLE,
			'Lakki Reddy' => self::GOOGLE,
			'Lalezar' => self::GOOGLE,
			'Lancelot' => self::GOOGLE,
			'Langar' => self::GOOGLE,
			'Lateef' => self::GOOGLE,
			'Lato' => self::GOOGLE,
			'League Script' => self::GOOGLE,
			'Leckerli One' => self::GOOGLE,
			'Ledger' => self::GOOGLE,
			'Lekton' => self::GOOGLE,
			'Lemon' => self::GOOGLE,
			'Lemonada' => self::GOOGLE,
			'Lexend' => self::GOOGLE,
			'Lexend Deca' => self::GOOGLE,
			'Lexend Exa' => self::GOOGLE,
			'Lexend Giga' => self::GOOGLE,
			'Lexend Mega' => self::GOOGLE,
			'Lexend Peta' => self::GOOGLE,
			'Lexend Tera' => self::GOOGLE,
			'Lexend Zetta' => self::GOOGLE,
			'Libre Barcode 128' => self::GOOGLE,
			'Libre Barcode 128 Text' => self::GOOGLE,
			'Libre Barcode 39' => self::GOOGLE,
			'Libre Barcode 39 Extended' => self::GOOGLE,
			'Libre Barcode 39 Extended Text' => self::GOOGLE,
			'Libre Barcode 39 Text' => self::GOOGLE,
			'Libre Barcode EAN13 Text' => self::GOOGLE,
			'Libre Baskerville' => self::GOOGLE,
			'Libre Caslon Display' => self::GOOGLE,
			'Libre Caslon Text' => self::GOOGLE,
			'Libre Franklin' => self::GOOGLE,
			'Life Savers' => self::GOOGLE,
			'Lilita One' => self::GOOGLE,
			'Lily Script One' => self::GOOGLE,
			'Limelight' => self::GOOGLE,
			'Linden Hill' => self::GOOGLE,
			'Literata' => self::GOOGLE,
			'Liu Jian Mao Cao' => self::GOOGLE,
			'Livvic' => self::GOOGLE,
			'Lobster' => self::GOOGLE,
			'Lobster Two' => self::GOOGLE,
			'Londrina Outline' => self::GOOGLE,
			'Londrina Shadow' => self::GOOGLE,
			'Londrina Sketch' => self::GOOGLE,
			'Londrina Solid' => self::GOOGLE,
			'Long Cang' => self::GOOGLE,
			'Lora' => self::GOOGLE,
			'Love Ya Like A Sister' => self::GOOGLE,
			'Loved by the King' => self::GOOGLE,
			'Lovers Quarrel' => self::GOOGLE,
			'Luckiest Guy' => self::GOOGLE,
			'Lusitana' => self::GOOGLE,
			'Lustria' => self::GOOGLE,
			'M PLUS 1p' => self::GOOGLE,
			'M PLUS Rounded 1c' => self::GOOGLE,
			'Ma Shan Zheng' => self::GOOGLE,
			'Macondo' => self::GOOGLE,
			'Macondo Swash Caps' => self::GOOGLE,
			'Mada' => self::GOOGLE,
			'Magra' => self::GOOGLE,
			'Maiden Orange' => self::GOOGLE,
			'Maitree' => self::GOOGLE,
			'Major Mono Display' => self::GOOGLE,
			'Mako' => self::GOOGLE,
			'Mali' => self::GOOGLE,
			'Mallanna' => self::GOOGLE,
			'Mandali' => self::GOOGLE,
			'Manjari' => self::GOOGLE,
			'Manrope' => self::GOOGLE,
			'Mansalva' => self::GOOGLE,
			'Manuale' => self::GOOGLE,
			'Marcellus' => self::GOOGLE,
			'Marcellus SC' => self::GOOGLE,
			'Marck Script' => self::GOOGLE,
			'Margarine' => self::GOOGLE,
			'Markazi Text' => self::GOOGLE,
			'Marko One' => self::GOOGLE,
			'Marmelad' => self::GOOGLE,
			'Martel' => self::GOOGLE,
			'Martel Sans' => self::GOOGLE,
			'Marvel' => self::GOOGLE,
			'Mate' => self::GOOGLE,
			'Mate SC' => self::GOOGLE,
			'Maven Pro' => self::GOOGLE,
			'McLaren' => self::GOOGLE,
			'Meddon' => self::GOOGLE,
			'MedievalSharp' => self::GOOGLE,
			'Medula One' => self::GOOGLE,
			'Meera Inimai' => self::GOOGLE,
			'Megrim' => self::GOOGLE,
			'Meie Script' => self::GOOGLE,
			'Merienda' => self::GOOGLE,
			'Merienda One' => self::GOOGLE,
			'Merriweather' => self::GOOGLE,
			'Merriweather Sans' => self::GOOGLE,
			'Metal' => self::GOOGLE,
			'Metal Mania' => self::GOOGLE,
			'Metamorphous' => self::GOOGLE,
			'Metrophobic' => self::GOOGLE,
			'Michroma' => self::GOOGLE,
			'Milonga' => self::GOOGLE,
			'Miltonian' => self::GOOGLE,
			'Miltonian Tattoo' => self::GOOGLE,
			'Mina' => self::GOOGLE,
			'Miniver' => self::GOOGLE,
			'Miriam Libre' => self::GOOGLE,
			'Mirza' => self::GOOGLE,
			'Miss Fajardose' => self::GOOGLE,
			'Mitr' => self::GOOGLE,
			'Modak' => self::GOOGLE,
			'Modern Antiqua' => self::GOOGLE,
			'Mogra' => self::GOOGLE,
			'Molengo' => self::GOOGLE,
			'Molle' => self::GOOGLE,
			'Monda' => self::GOOGLE,
			'Monofett' => self::GOOGLE,
			'Monoton' => self::GOOGLE,
			'Monsieur La Doulaise' => self::GOOGLE,
			'Montaga' => self::GOOGLE,
			'Montez' => self::GOOGLE,
			'Montserrat' => self::GOOGLE,
			'Montserrat Alternates' => self::GOOGLE,
			'Montserrat Subrayada' => self::GOOGLE,
			'Moul' => self::GOOGLE,
			'Moulpali' => self::GOOGLE,
			'Mountains of Christmas' => self::GOOGLE,
			'Mouse Memoirs' => self::GOOGLE,
			'Mr Bedfort' => self::GOOGLE,
			'Mr Dafoe' => self::GOOGLE,
			'Mr De Haviland' => self::GOOGLE,
			'Mrs Saint Delafield' => self::GOOGLE,
			'Mrs Sheppards' => self::GOOGLE,
			'Mukta' => self::GOOGLE,
			'Mukta Mahee' => self::GOOGLE,
			'Mukta Malar' => self::GOOGLE,
			'Mukta Vaani' => self::GOOGLE,
			'Mulish' => self::GOOGLE,
			'MuseoModerno' => self::GOOGLE,
			'Mystery Quest' => self::GOOGLE,
			'NTR' => self::GOOGLE,
			'Nanum Brush Script' => self::GOOGLE,
			'Nanum Gothic' => self::GOOGLE,
			'Nanum Gothic Coding' => self::GOOGLE,
			'Nanum Myeongjo' => self::GOOGLE,
			'Nanum Pen Script' => self::GOOGLE,
			'Nerko One' => self::GOOGLE,
			'Neucha' => self::GOOGLE,
			'Neuton' => self::GOOGLE,
			'New Rocker' => self::GOOGLE,
			'New Tegomin' => self::GOOGLE,
			'News Cycle' => self::GOOGLE,
			'Newsreader' => self::GOOGLE,
			'Niconne' => self::GOOGLE,
			'Niramit' => self::GOOGLE,
			'Nixie One' => self::GOOGLE,
			'Nobile' => self::GOOGLE,
			'Nokora' => self::GOOGLE,
			'Norican' => self::GOOGLE,
			'Nosifer' => self::GOOGLE,
			'Notable' => self::GOOGLE,
			'Nothing You Could Do' => self::GOOGLE,
			'Noticia Text' => self::GOOGLE,
			'Noto Kufi Arabic' => self::EARLYACCESS, // Hack for Google Early Access.
			'Noto Naskh Arabic' => self::EARLYACCESS, // Hack for Google Early Access.
			'Noto Sans' => self::GOOGLE,
			'Noto Sans HK' => self::GOOGLE,
			'Noto Sans Hebrew' => self::EARLYACCESS, // Hack for Google Early Access.
			'Noto Sans JP' => self::GOOGLE,
			'Noto Sans KR' => self::GOOGLE,
			'Noto Sans SC' => self::GOOGLE,
			'Noto Sans TC' => self::GOOGLE,
			'Noto Serif' => self::GOOGLE,
			'Noto Serif JP' => self::GOOGLE,
			'Noto Serif KR' => self::GOOGLE,
			'Noto Serif SC' => self::GOOGLE,
			'Noto Serif TC' => self::GOOGLE,
			'Nova Cut' => self::GOOGLE,
			'Nova Flat' => self::GOOGLE,
			'Nova Mono' => self::GOOGLE,
			'Nova Oval' => self::GOOGLE,
			'Nova Round' => self::GOOGLE,
			'Nova Script' => self::GOOGLE,
			'Nova Slim' => self::GOOGLE,
			'Nova Square' => self::GOOGLE,
			'Numans' => self::GOOGLE,
			'Nunito' => self::GOOGLE,
			'Nunito Sans' => self::GOOGLE,
			'Odibee Sans' => self::GOOGLE,
			'Odor Mean Chey' => self::GOOGLE,
			'Offside' => self::GOOGLE,
			'Oi' => self::GOOGLE,
			'Old Standard TT' => self::GOOGLE,
			'Oldenburg' => self::GOOGLE,
			'Oleo Script' => self::GOOGLE,
			'Oleo Script Swash Caps' => self::GOOGLE,
			'Open Sans' => self::GOOGLE,
			'Open Sans Condensed' => self::GOOGLE,
			'Open Sans Hebrew' => self::EARLYACCESS, // Hack for Google Early Access.
			'Open Sans Hebrew Condensed' => self::EARLYACCESS, // Hack for Google Early Access.
			'Oranienbaum' => self::GOOGLE,
			'Orbitron' => self::GOOGLE,
			'Oregano' => self::GOOGLE,
			'Orelega One' => self::GOOGLE,
			'Orienta' => self::GOOGLE,
			'Original Surfer' => self::GOOGLE,
			'Oswald' => self::GOOGLE,
			'Over the Rainbow' => self::GOOGLE,
			'Overlock' => self::GOOGLE,
			'Overlock SC' => self::GOOGLE,
			'Overpass' => self::GOOGLE,
			'Overpass Mono' => self::GOOGLE,
			'Ovo' => self::GOOGLE,
			'Oxanium' => self::GOOGLE,
			'Oxygen' => self::GOOGLE,
			'Oxygen Mono' => self::GOOGLE,
			'PT Mono' => self::GOOGLE,
			'PT Sans' => self::GOOGLE,
			'PT Sans Caption' => self::GOOGLE,
			'PT Sans Narrow' => self::GOOGLE,
			'PT Serif' => self::GOOGLE,
			'PT Serif Caption' => self::GOOGLE,
			'Pacifico' => self::GOOGLE,
			'Padauk' => self::GOOGLE,
			'Palanquin' => self::GOOGLE,
			'Palanquin Dark' => self::GOOGLE,
			'Pangolin' => self::GOOGLE,
			'Paprika' => self::GOOGLE,
			'Parisienne' => self::GOOGLE,
			'Passero One' => self::GOOGLE,
			'Passion One' => self::GOOGLE,
			'Pathway Gothic One' => self::GOOGLE,
			'Patrick Hand' => self::GOOGLE,
			'Patrick Hand SC' => self::GOOGLE,
			'Pattaya' => self::GOOGLE,
			'Patua One' => self::GOOGLE,
			'Pavanam' => self::GOOGLE,
			'Paytone One' => self::GOOGLE,
			'Peddana' => self::GOOGLE,
			'Peralta' => self::GOOGLE,
			'Permanent Marker' => self::GOOGLE,
			'Petit Formal Script' => self::GOOGLE,
			'Petrona' => self::GOOGLE,
			'Philosopher' => self::GOOGLE,
			'Piazzolla' => self::GOOGLE,
			'Piedra' => self::GOOGLE,
			'Pinyon Script' => self::GOOGLE,
			'Pirata One' => self::GOOGLE,
			'Plaster' => self::GOOGLE,
			'Play' => self::GOOGLE,
			'Playball' => self::GOOGLE,
			'Playfair Display' => self::GOOGLE,
			'Playfair Display SC' => self::GOOGLE,
			'Podkova' => self::GOOGLE,
			'Poiret One' => self::GOOGLE,
			'Poller One' => self::GOOGLE,
			'Poly' => self::GOOGLE,
			'Pompiere' => self::GOOGLE,
			'Pontano Sans' => self::GOOGLE,
			'Poor Story' => self::GOOGLE,
			'Poppins' => self::GOOGLE,
			'Port Lligat Sans' => self::GOOGLE,
			'Port Lligat Slab' => self::GOOGLE,
			'Potta One' => self::GOOGLE,
			'Pragati Narrow' => self::GOOGLE,
			'Prata' => self::GOOGLE,
			'Preahvihear' => self::GOOGLE,
			'Press Start 2P' => self::GOOGLE,
			'Pridi' => self::GOOGLE,
			'Princess Sofia' => self::GOOGLE,
			'Prociono' => self::GOOGLE,
			'Prompt' => self::GOOGLE,
			'Prosto One' => self::GOOGLE,
			'Proza Libre' => self::GOOGLE,
			'Public Sans' => self::GOOGLE,
			'Puritan' => self::GOOGLE,
			'Purple Purse' => self::GOOGLE,
			'Quando' => self::GOOGLE,
			'Quantico' => self::GOOGLE,
			'Quattrocento' => self::GOOGLE,
			'Quattrocento Sans' => self::GOOGLE,
			'Questrial' => self::GOOGLE,
			'Quicksand' => self::GOOGLE,
			'Quintessential' => self::GOOGLE,
			'Qwigley' => self::GOOGLE,
			'Racing Sans One' => self::GOOGLE,
			'Radley' => self::GOOGLE,
			'Rajdhani' => self::GOOGLE,
			'Rakkas' => self::GOOGLE,
			'Raleway' => self::GOOGLE,
			'Raleway Dots' => self::GOOGLE,
			'Ramabhadra' => self::GOOGLE,
			'Ramaraja' => self::GOOGLE,
			'Rambla' => self::GOOGLE,
			'Rammetto One' => self::GOOGLE,
			'Ranchers' => self::GOOGLE,
			'Rancho' => self::GOOGLE,
			'Ranga' => self::GOOGLE,
			'Rasa' => self::GOOGLE,
			'Rationale' => self::GOOGLE,
			'Ravi Prakash' => self::GOOGLE,
			'Recursive' => self::GOOGLE,
			'Red Hat Display' => self::GOOGLE,
			'Red Hat Text' => self::GOOGLE,
			'Red Rose' => self::GOOGLE,
			'Redressed' => self::GOOGLE,
			'Reem Kufi' => self::GOOGLE,
			'Reenie Beanie' => self::GOOGLE,
			'Reggae One' => self::GOOGLE,
			'Revalia' => self::GOOGLE,
			'Rhodium Libre' => self::GOOGLE,
			'Ribeye' => self::GOOGLE,
			'Ribeye Marrow' => self::GOOGLE,
			'Righteous' => self::GOOGLE,
			'Risque' => self::GOOGLE,
			'Roboto' => self::GOOGLE,
			'Roboto Condensed' => self::GOOGLE,
			'Roboto Mono' => self::GOOGLE,
			'Roboto Slab' => self::GOOGLE,
			'Rochester' => self::GOOGLE,
			'Rock Salt' => self::GOOGLE,
			'RocknRoll One' => self::GOOGLE,
			'Rokkitt' => self::GOOGLE,
			'Romanesco' => self::GOOGLE,
			'Ropa Sans' => self::GOOGLE,
			'Rosario' => self::GOOGLE,
			'Rosarivo' => self::GOOGLE,
			'Rouge Script' => self::GOOGLE,
			'Rowdies' => self::GOOGLE,
			'Rozha One' => self::GOOGLE,
			'Rubik' => self::GOOGLE,
			'Rubik Mono One' => self::GOOGLE,
			'Ruda' => self::GOOGLE,
			'Rufina' => self::GOOGLE,
			'Ruge Boogie' => self::GOOGLE,
			'Ruluko' => self::GOOGLE,
			'Rum Raisin' => self::GOOGLE,
			'Ruslan Display' => self::GOOGLE,
			'Russo One' => self::GOOGLE,
			'Ruthie' => self::GOOGLE,
			'Rye' => self::GOOGLE,
			'Sacramento' => self::GOOGLE,
			'Sahitya' => self::GOOGLE,
			'Sail' => self::GOOGLE,
			'Saira' => self::GOOGLE,
			'Saira Condensed' => self::GOOGLE,
			'Saira Extra Condensed' => self::GOOGLE,
			'Saira Semi Condensed' => self::GOOGLE,
			'Saira Stencil One' => self::GOOGLE,
			'Salsa' => self::GOOGLE,
			'Sanchez' => self::GOOGLE,
			'Sancreek' => self::GOOGLE,
			'Sansita' => self::GOOGLE,
			'Sansita Swashed' => self::GOOGLE,
			'Sarabun' => self::GOOGLE,
			'Sarala' => self::GOOGLE,
			'Sarina' => self::GOOGLE,
			'Sarpanch' => self::GOOGLE,
			'Satisfy' => self::GOOGLE,
			'Sawarabi Gothic' => self::GOOGLE,
			'Sawarabi Mincho' => self::GOOGLE,
			'Scada' => self::GOOGLE,
			'Scheherazade' => self::GOOGLE,
			'Schoolbell' => self::GOOGLE,
			'Scope One' => self::GOOGLE,
			'Seaweed Script' => self::GOOGLE,
			'Secular One' => self::GOOGLE,
			'Sedgwick Ave' => self::GOOGLE,
			'Sedgwick Ave Display' => self::GOOGLE,
			'Sen' => self::GOOGLE,
			'Sevillana' => self::GOOGLE,
			'Seymour One' => self::GOOGLE,
			'Shadows Into Light' => self::GOOGLE,
			'Shadows Into Light Two' => self::GOOGLE,
			'Shanti' => self::GOOGLE,
			'Share' => self::GOOGLE,
			'Share Tech' => self::GOOGLE,
			'Share Tech Mono' => self::GOOGLE,
			'Shippori Mincho' => self::GOOGLE,
			'Shippori Mincho B1' => self::GOOGLE,
			'Shojumaru' => self::GOOGLE,
			'Short Stack' => self::GOOGLE,
			'Shrikhand' => self::GOOGLE,
			'Siemreap' => self::GOOGLE,
			'Sigmar One' => self::GOOGLE,
			'Signika' => self::GOOGLE,
			'Signika Negative' => self::GOOGLE,
			'Simonetta' => self::GOOGLE,
			'Single Day' => self::GOOGLE,
			'Sintony' => self::GOOGLE,
			'Sirin Stencil' => self::GOOGLE,
			'Six Caps' => self::GOOGLE,
			'Skranji' => self::GOOGLE,
			'Slabo 13px' => self::GOOGLE,
			'Slabo 27px' => self::GOOGLE,
			'Slackey' => self::GOOGLE,
			'Smokum' => self::GOOGLE,
			'Smythe' => self::GOOGLE,
			'Sniglet' => self::GOOGLE,
			'Snippet' => self::GOOGLE,
			'Snowburst One' => self::GOOGLE,
			'Sofadi One' => self::GOOGLE,
			'Sofia' => self::GOOGLE,
			'Solway' => self::GOOGLE,
			'Song Myung' => self::GOOGLE,
			'Sonsie One' => self::GOOGLE,
			'Sora' => self::GOOGLE,
			'Sorts Mill Goudy' => self::GOOGLE,
			'Source Code Pro' => self::GOOGLE,
			'Source Sans Pro' => self::GOOGLE,
			'Source Serif Pro' => self::GOOGLE,
			'Space Grotesk' => self::GOOGLE,
			'Space Mono' => self::GOOGLE,
			'Spartan' => self::GOOGLE,
			'Special Elite' => self::GOOGLE,
			'Spectral' => self::GOOGLE,
			'Spectral SC' => self::GOOGLE,
			'Spicy Rice' => self::GOOGLE,
			'Spinnaker' => self::GOOGLE,
			'Spirax' => self::GOOGLE,
			'Squada One' => self::GOOGLE,
			'Sree Krushnadevaraya' => self::GOOGLE,
			'Sriracha' => self::GOOGLE,
			'Srisakdi' => self::GOOGLE,
			'Staatliches' => self::GOOGLE,
			'Stalemate' => self::GOOGLE,
			'Stalinist One' => self::GOOGLE,
			'Stardos Stencil' => self::GOOGLE,
			'Stick' => self::GOOGLE,
			'Stint Ultra Condensed' => self::GOOGLE,
			'Stint Ultra Expanded' => self::GOOGLE,
			'Stoke' => self::GOOGLE,
			'Strait' => self::GOOGLE,
			'Stylish' => self::GOOGLE,
			'Sue Ellen Francisco' => self::GOOGLE,
			'Suez One' => self::GOOGLE,
			'Sulphur Point' => self::GOOGLE,
			'Sumana' => self::GOOGLE,
			'Sunflower' => self::GOOGLE,
			'Sunshiney' => self::GOOGLE,
			'Supermercado One' => self::GOOGLE,
			'Sura' => self::GOOGLE,
			'Suranna' => self::GOOGLE,
			'Suravaram' => self::GOOGLE,
			'Suwannaphum' => self::GOOGLE,
			'Swanky and Moo Moo' => self::GOOGLE,
			'Syncopate' => self::GOOGLE,
			'Syne' => self::GOOGLE,
			'Syne Mono' => self::GOOGLE,
			'Syne Tactile' => self::GOOGLE,
			'Tajawal' => self::GOOGLE,
			'Tangerine' => self::GOOGLE,
			'Taprom' => self::GOOGLE,
			'Tauri' => self::GOOGLE,
			'Taviraj' => self::GOOGLE,
			'Teko' => self::GOOGLE,
			'Telex' => self::GOOGLE,
			'Tenali Ramakrishna' => self::GOOGLE,
			'Tenor Sans' => self::GOOGLE,
			'Text Me One' => self::GOOGLE,
			'Texturina' => self::GOOGLE,
			'Thasadith' => self::GOOGLE,
			'The Girl Next Door' => self::GOOGLE,
			'Tienne' => self::GOOGLE,
			'Tillana' => self::GOOGLE,
			'Timmana' => self::GOOGLE,
			'Tinos' => self::GOOGLE,
			'Titan One' => self::GOOGLE,
			'Titillium Web' => self::GOOGLE,
			'Tomorrow' => self::GOOGLE,
			'Trade Winds' => self::GOOGLE,
			'Train One' => self::GOOGLE,
			'Trirong' => self::GOOGLE,
			'Trispace' => self::GOOGLE,
			'Trocchi' => self::GOOGLE,
			'Trochut' => self::GOOGLE,
			'Truculenta' => self::GOOGLE,
			'Trykker' => self::GOOGLE,
			'Tulpen One' => self::GOOGLE,
			'Turret Road' => self::GOOGLE,
			'Ubuntu' => self::GOOGLE,
			'Ubuntu Condensed' => self::GOOGLE,
			'Ubuntu Mono' => self::GOOGLE,
			'Ultra' => self::GOOGLE,
			'Uncial Antiqua' => self::GOOGLE,
			'Underdog' => self::GOOGLE,
			'Unica One' => self::GOOGLE,
			'UnifrakturCook' => self::GOOGLE,
			'UnifrakturMaguntia' => self::GOOGLE,
			'Unkempt' => self::GOOGLE,
			'Unlock' => self::GOOGLE,
			'Unna' => self::GOOGLE,
			'VT323' => self::GOOGLE,
			'Vampiro One' => self::GOOGLE,
			'Varela' => self::GOOGLE,
			'Varela Round' => self::GOOGLE,
			'Varta' => self::GOOGLE,
			'Vast Shadow' => self::GOOGLE,
			'Vesper Libre' => self::GOOGLE,
			'Viaoda Libre' => self::GOOGLE,
			'Vibes' => self::GOOGLE,
			'Vibur' => self::GOOGLE,
			'Vidaloka' => self::GOOGLE,
			'Viga' => self::GOOGLE,
			'Voces' => self::GOOGLE,
			'Volkhov' => self::GOOGLE,
			'Vollkorn' => self::GOOGLE,
			'Vollkorn SC' => self::GOOGLE,
			'Voltaire' => self::GOOGLE,
			'Waiting for the Sunrise' => self::GOOGLE,
			'Wallpoet' => self::GOOGLE,
			'Walter Turncoat' => self::GOOGLE,
			'Warnes' => self::GOOGLE,
			'Wellfleet' => self::GOOGLE,
			'Wendy One' => self::GOOGLE,
			'Wire One' => self::GOOGLE,
			'Work Sans' => self::GOOGLE,
			'Xanh Mono' => self::GOOGLE,
			'Yanone Kaffeesatz' => self::GOOGLE,
			'Yantramanav' => self::GOOGLE,
			'Yatra One' => self::GOOGLE,
			'Yellowtail' => self::GOOGLE,
			'Yeon Sung' => self::GOOGLE,
			'Yeseva One' => self::GOOGLE,
			'Yesteryear' => self::GOOGLE,
			'Yrsa' => self::GOOGLE,
			'Yusei Magic' => self::GOOGLE,
			'ZCOOL KuaiLe' => self::GOOGLE,
			'ZCOOL QingKe HuangYou' => self::GOOGLE,
			'ZCOOL XiaoWei' => self::GOOGLE,
			'Zen Dots' => self::GOOGLE,
			'Zeyada' => self::GOOGLE,
			'Zhi Mang Xing' => self::GOOGLE,
			'Zilla Slab' => self::GOOGLE,
			'Zilla Slab Highlight' => self::GOOGLE,
		];
	}

	/**
	 * Get font type.
	 *
	 * Retrieve the font type for a given font.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param string $name Font name.
	 *
	 * @return string|false Font type, or false if font doesn't exist.
	 */
	public static function get_font_type( $name ) {
		$fonts = self::get_fonts();

		if ( empty( $fonts[ $name ] ) ) {
			return false;
		}

		return $fonts[ $name ];
	}

	/**
	 * Get fonts by group.
	 *
	 * Retrieve all the fonts belong to specific group.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param array $groups Optional. Font group. Default is an empty array.
	 *
	 * @return array Font type, or false if font doesn't exist.
	 */
	public static function get_fonts_by_groups( $groups = [] ) {
		return array_filter( self::get_fonts(), function( $font ) use ( $groups ) {
			return in_array( $font, $groups );
		} );
	}

	public static function get_font_display_setting() {
		return get_option( 'elementor_font_display', 'auto' );
	}
}
