dorothy('ITEM', function (data) {
	console.log('ITEM');
	console.assert(data.view.isSingleItem, '1');
});

dorothy('POST', function (data) {
	console.log('POST');
	console.assert(data.view.isPost, '2');
});

dorothy('PAGE', function (data) {
	console.log('PAGE');
	console.assert(data.view.isPage, '3');
});

dorothy('FEED', function (data) {
	console.log('FEED');
	console.assert(data.view.isMultipleItems, '4');
});

dorothy('HOME', function (data) {
	console.log('HOME');
	console.assert(data.view.isHomepage, '5');
});

dorothy('QUERY', function (data) {
	console.log('QUERY');
	console.assert(typeof data.view.search.query === 'string', '6');
});

dorothy('LABEL', function (data) {
	console.log('LABEL');
	console.assert(data.view.isLabelSearch, '7');
});

dorothy('ERROR', function (data) {
	console.log('ERROR');
	console.assert(data.view.isError, '8');
});

dorothy('SEARCH', function (data) {
	console.log('SEARCH');
	console.assert(data.view.isSearch, '9');
});

dorothy('ARCHIVE', function (data) {
	console.log('ARCHIVE');
	console.assert(data.view.isArchive, '10');
});

dorothy('ITEM|ERROR', function (data) {
	console.log('ITEM|ERROR');
	console.assert(data.view.isSingleItem || data.view.isError, '11');
});

dorothy('SEARCH|ARCHIVE', function (data) {
	console.log('SEARCH|ARCHIVE');
	console.assert((data.view.isSearch || data.view.isArchive) && !data.blog.isMobileRequest, '12');
}, false);