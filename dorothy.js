(function () {
	'use strict';

	/**
	 * Blog data
	 * @type {BlogData}
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
	 * @type {DorothyItem[]}
	 */
	var _queue = [];

	/**
	 * Evaluation of `DorothyItem` that could be executed
	 * @param {DorothyItem} item
	 */
	function _exec(item) {
		var isRunnable = false;
		var pageTypesArr = item.pageTypes.split('|');

		pageTypesArr.forEach(function (pageType) {
			isRunnable = isRunnable || _view[pageType];
		});

		if (isRunnable && (item.applyMobile || !_view.MOBILE)) {
			item.callbackFn(_data);
		}
	}

	/**
	 * Converts `dorothy` arguments to a `DorothyItem`
	 * @param {!string} pageTypes
	 * @param {!DorothyCallback} callbackFn
	 * @param {boolean} [applyMobile=true]
	 * @throws Throws an error if provided params contains not corresponding types
	 * @returns {DorothyItem}
	 */
	function _pack(pageTypes, callbackFn, applyMobile) {
		if (typeof pageTypes !== 'string') {
			throw new Error('First param needs to be a `string`');
		}

		if (typeof callbackFn !== 'function') {
			throw new Error('Second param needs to be a `function`');
		}

		if (applyMobile && typeof applyMobile !== 'boolean') {
			throw new Error('Third param needs to be a `boolean`');
		}

		return {
			pageTypes: pageTypes,
			callbackFn: callbackFn,
			applyMobile: applyMobile
		};
	}

	/**
	 * @alias dorothy
	 * @param {!string} pageTypes - Pipe-delimited page types
	 * @param {!DorothyCallback} callbackFn - Routine to execute
	 * @param {boolean} [applyMobile=true] - Flag to enable or disable running on mobile requests
	 * @throws Throws an error if provided params contains not corresponding types
	 * @example
	 * // Available page types:
	 * // ALL, ITEM, POST, PAGE, FEED, HOME,
	 * // QUERY, LABEL, ERROR, SEARCH, ARCHIVE
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
	function _dorothy(pageTypes, callbackFn, applyMobile) {
		var item = _pack(pageTypes, callbackFn, applyMobile);

		if (_data !== null) {
			_exec(item);
		} else {
			_queue.push(item);
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

		_queue.forEach(_exec);
	});
}());

/**
 * Blog data from Blogger API
 * @typedef BlogData
 * @todo Search for complete documentation of `_WidgetManager.GetAllData()`
 */

/**
 * @typedef DorothyItem
 * @property {string} pageTypes
 * @property {DorothyCallback} callbackFn
 * @property {boolean} applyMobile
 */

/**
 * @callback DorothyCallback
 * @param {BlogData} data
 */
 