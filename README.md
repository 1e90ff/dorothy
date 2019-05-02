# Dorothy

A simple way to condition your JS code execution based on page types for Blogger blogs.

## Setup

Add to your XML template the next script tag.

```xml
<script src="dorothy/dorothy.js" />
```

## Method

```
dorothy(pageTypes, callbackFn[, applyMobile=true]);
```

1. `pageTypes`, a single or multiple page-types (pipe-delimited).
2. `callbackFn`, a function with the routine to execute.
3. `applyMobile`, a flag to enable or disable running on mobile requests.

## Example

```javascript
// Available page types:
// ALL, ITEM, POST, PAGE, FEED, HOME,
// QUERY, LABEL, ERROR, SEARCH, ARCHIVE

dorothy('HOME', function (data) {
  alert('Welcome to ' + data.blog.title + '!');
});

dorothy('POST|PAGE', function (data) {
  alert('You are reading: "' + data.view.title + '".');
}, false);
```

## License

See the LICENSE file included in this project for details.
