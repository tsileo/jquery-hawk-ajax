# jQuery hawkAjax plugin

A jQuery plugin to use the [hawk](https://github.com/hueniverse/hawk) HTTP authentication scheme with ``$.ajax``.

## Requirements

- jQuery
- [hawk](https://github.com/hueniverse/hawk/blob/master/lib/browser.js)

## Usage

It works like jQuery ``$.ajax`` except:

- it takes an extra object as first argument containing credentials.
- the promise will be rejected if the response failed to be authenticated

```javascript
var credentials = {
    id: "",
    key: "",
    algorithm: "sha1",
};
$.hawkAjax(credentials, {"url": "/api/endpoint"}).done(function(data, textStatus, req) {
	console.log(data);
})
```
