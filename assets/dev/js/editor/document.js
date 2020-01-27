import HistoryModule from './document/history/module';
import RevisionsManager from 'elementor/modules/history/assets/js/revisions/manager';

/**
 * TODO: Wrong class name + location, conflict with 'editor.js'.
 */
class Editor {
	/**
	 * Editor status.
	 *
	 * @type {'open'|'closed'}
	 */
	status = 'closed';

	/**
	 * Is document still saving?.
	 *
	 * @type {boolean}
	 */
	isSaving = false;

	/**
	 * Is document changed?.
	 *
	 * @type {boolean}
	 */
	isChanged = false;

	/**
	 * Is document changed during save?.
	 *
	 * @type {boolean}
	 */
	isChangedDuringSave = false;

	/**
	 * Is document saved?
	 *
	 * @type {boolean}
	 */
	isSaved = true;
}

export default class Document {
	/**
	 * Document id.
	 *
	 * @type {number|null}
	 */
	id = null;

	/**
	 * History of the document.
	 *
	 * @type {HistoryModule}
	 */
	history = null;

	/**
	 * Revisions of the document.
	 *
	 * @type {RevisionsManager}
	 */
	revisions = null;

	/**
	 * Current container.
	 *
	 * @type {Container}
	 */
	container = null;

	/**
	 * Editor Settings.
	 *
	 * @type {Editor}
	 */
	editor = new Editor();

	/**
	 * Function constructor().
	 *
	 * Create document.
	 *
	 * @param {{}} config
	 * @param {Container} container
	 */
	constructor( config ) {
		this.config = config;
		this.id = config.id;

		this.history = new HistoryModule();
		this.revisions = new RevisionsManager( this );
	}
}
