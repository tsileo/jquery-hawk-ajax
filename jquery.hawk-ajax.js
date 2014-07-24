(function($, window){
function resolveURL(url) {
  var base_url = window.location.protocol+"//"+window.location.host;
  var doc      = document
    , old_base = doc.getElementsByTagName('base')[0]
    , old_href = old_base && old_base.href
    , doc_head = doc.head || doc.getElementsByTagName('head')[0]
    , our_base = old_base || doc_head.appendChild(doc.createElement('base'))
    , resolver = doc.createElement('a')
    , resolved_url
    ;
  our_base.href = base_url;
  resolver.href = url;
  resolved_url  = resolver.href; // browser magic at work here
  if (old_base) old_base.href = old_href;
  else doc_head.removeChild(our_base);
  return resolved_url;
}
$.extend({
    //$.hawkAjax({id: "", key: "", algorithm: "sha1"}, {url: "/api/path"})
    // see directly below for possible 'options'
    hawkAjax: function (credentials, options) {
        deferred = $.Deferred();
        var beforeSend = function(req) {
            hawkData = hawk.client.header(resolveURL(options.url), options.method || "GET", {credentials: credentials});
            req.setRequestHeader("Authorization", hawkData.field);
            req.artifacts = hawkData.artifacts;
        };
        options = $.extend(options, {beforeSend: beforeSend});
        $.ajax(options).done(function(jqXHR, textStatus, req) {
            if (req.status == 200) {
                valid = hawk.client.authenticate(req, credentials, req.artifacts, {});
                if (valid) {
                    deferred.resolve(jqXHR, textStatus, req);
                } else {
                    console.log("Hawk error: response not authenticated");
                    deferred.reject(jqXHR, textStatus, req);
                };
            };
        }).fail(function(jqXHR, textStatus, req) {
            deferred.reject(jqXHR, textStatus, req);
        });
        return deferred.promise();
    }
});
})(jQuery, this);