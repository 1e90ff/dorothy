/**
 * Blog data from Blogger API
 * @typedef bloggerData
 * @todo Search for complete documentation of `_WidgetManager.GetAllData()`
 */

/**
 * @callback dFunction
 * @param {bloggerData} data
 */

/**
 * @typedef dItem
 * @property {string} pageTypes
 * @property {dFunction} callbackFn
 * @property {boolean} applyMobile
 */

(function () {
	'use strict';

	/**
	 * Blog data
	 * @type {bloggerData}
	 */
	var _data = null;

	/**
	 * Blog view switches
	 * @type {Object.<string, boolean>}
	 */
	var _view = {
		ALL: true,
		ITEM: false,
		POST: false,
		PAGE: false,
		FEED: false,
		HOME: false,
		QUERY: false,
		LABEL: false,
		ERROR: false,
		MOBILE: false,
		SEARCH: false,
		ARCHIVE: false
	};

	/**
	 * Items to be evaluated after window load complete
	 * @type {dItem[]}
	 */
	var _queue = [];

	/**
	 * Evaluation of `dItem` that could be executed
	 * @param {dItem} item
	 */
	function _eval(item) {
		var start = false;
		var types = item.pageTypes.split('|');

		types.forEach(function (type) {
			start = start || _view[type];
		});

		if (start && (item.applyMobile || !_view.MOBILE)) {
			item.callbackFn(_data);
		}
	}

	/**
	 * Transforms `dorothy` arguments into a `dItem`
	 * @param {Array.<(string|dFunction|boolean)>} args
	 * @throws Throws an error if provided params contains not corresponding types
	 * @returns {dItem}
	 */
	function _pack(args) {
		var item = {
			pageTypes: null,
			callbackFn: null,
			applyMobile: true
		};

		if (typeof args[0] === 'string') {
			item.pageTypes = args[0].toUpperCase();
		} else {
			throw new Error('First param needs to be a `string`');
		}

		if (typeof args[1] === 'function') {
			item.callbackFn = args[1];
		} else {
			throw new Error('Second param needs to be a `function`');
		}

		if (typeof args[2] === 'boolean') {
			item.applyMobile = args[2];
		}

		return item;
	}

	/**
	 * @alias dorothy
	 * @param {!string} pageTypes - Page type condition
	 * @param {!dFunction} callbackFn - Routine to execute
	 * @param {boolean} [applyMobile=true] - Enable or disable running on mobile requests
	 * @example
	 * // Available page types:
	 * // ALL,    ITEM,    POST,
	 * // PAGE,   FEED,    HOME,
	 * // QUERY,  LABEL,   ERROR,
	 * // SEARCH, ARCHIVE
	 *
	 * // Single page-type condition
	 * dorothy('HOME', function (data) {
	 *   alert('Welcome to ' + data.blog.title + '!');
	 * });
	 *
	 * // Multiple page-type conditions
	 * dorothy('POST|PAGE', function (data) {
	 *   alert('You are reading: "' + data.view.title + '".');
	 * }, false);
	 */
	function _dorothy() {
		var item;

		try {
			item = _pack(arguments);

			if (_data === null) {
				_queue.push(item);
			} else {
				_eval(item);
			}
		} catch (x) {
			console.error(x);
		}
	}

	window.dorothy = _dorothy;

	window.addEventListener('load', function () {
		_data = this._WidgetManager._GetAllData();

		_view.SEARCH = _data.view.isSearch || false;
		_view.ITEM = _data.view.isSingleItem;
		_view.POST = _data.view.isPost;
		_view.PAGE = _data.view.isPage;
		_view.FEED = _data.view.isMultipleItems;
		_view.HOME = _data.view.isHomepage;
		_view.QUERY = _view.SEARCH && !!_data.view.search.query;
		_view.LABEL = _data.view.isLabelSearch;
		_view.ERROR = _data.view.isError;
		_view.MOBILE = _data.blog.isMobileRequest;
		_view.ARCHIVE = _data.view.isArchive;

		_queue.forEach(_eval);
	});
}());
 