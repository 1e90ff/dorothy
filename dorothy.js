(function () {
	'use strict';

	var _data     = '';
	var _view     = {};
	var _stack    = [];
	var _isReady  = false;
	var _isMobile = false;

	function _isTypeOf(data, type) {
		return data !== null && typeof data === type;
	}

	function _stripTags(str) {
		var    node           = document.createElement('i');
		       node.innerHTML = str.replace(/<\/?[^<>]*>/g, '');
		return node.innerText;
	}

	function _eval(item) {
		var cond   = item.rule === '';
		var params = item.rule.split('|');

		if (!cond) {
			params.forEach(function(param) {
				cond = cond || _view[param];
			});
		}

		if (cond && (item.mobile || !_isMobile)) {
			item.callback(JSON.parse(_data));
		}
	}

	function _map(args) {
		var item     = null;
		var rule     = args[0];
		var mobile   = args[2];
		var callback = args[1];

		if (_isTypeOf(callback, 'function')) {
			item = {
				rule:     '',
				mobile:   true,
				callback: callback
			};

			if (_isTypeOf(rule, 'string')) {
				item.rule = rule.toUpperCase();
			}

			if (_isTypeOf(mobile, 'boolean')) {
				item.mobile = mobile;
			}
		}

		return item;
	}

	function _init(dataSrc) {
		var data = {
			url:             dataSrc.view.url,
			baseUrl:         dataSrc.blog.homepageUrl,
			searchUrl:       dataSrc.blog.searchUrl,
			blogTitle:       _stripTags(dataSrc.blog.title),
			pageTitle:       _stripTags(dataSrc.view.title),
			featuredImage:   dataSrc.view.featuredImage || '',
			pageDescription: _stripTags(dataSrc.view.description)
		};

		if (_view.QUERY) {
			data.search = {
				query: _stripTags(dataSrc.view.search.query)
			};
		}

		if (_view.LABEL) {
			data.search = {
				label: _stripTags(dataSrc.view.search.label)
			};
		}

		if (_view.ARCHIVE) {
			data.archive = {
				year: dataSrc.view.archive.year
			};

			if (dataSrc.view.archive.month) {
				data.archive.month = dataSrc.view.archive.month;
			}
		}

		_data     = JSON.stringify(data);
		_isMobile = dataSrc.blog.isMobileRequest;
		_isReady  = true;

		_stack.forEach(_eval);
	}

	window.Dorothy = function() {
		return {
			is: function() {
				var item = _map(arguments);

				if (item) {
					if (_isReady) {
						_eval(item);
					} else {
						_stack.push(item);
					}
				}
			}
		};
	};

	window.addEventListener('load', function () {
		var dataSrc  = this._WidgetManager._GetAllData();
		var isSearch = dataSrc.view.isSearch || false;

		_view = {
			ITEM:    dataSrc.view.isSingleItem,
			POST:    dataSrc.view.isPost,
			PAGE:    dataSrc.view.isPage,
			FEED:    dataSrc.view.isMultipleItems,
			HOME:    dataSrc.view.isHomepage,
			QUERY:   isSearch && !!dataSrc.view.search.query,
			LABEL:   dataSrc.view.isLabelSearch,
			ERROR:   dataSrc.view.isError,
			SEARCH:  isSearch,
			ARCHIVE: dataSrc.view.isArchive
		};

		_init(dataSrc);
	});
}());