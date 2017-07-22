// Lazy loader
var lazyLoad = function(src, ready, callback, context) {
    var $ = jQuery;

    // Overload parameters
    if (ready !== true) {
        context = callback;
        callback = ready;
        ready = false;
    }

    // Set default context
    if (context) {
        context.unshift($);
    } else {
        context = [$];
    }

    // Ensure src is an array
    if (!$.isArray(src)) {
        src = [src];
    }

    // Load scripts
    var deferreds = [];
    for (var i = 0; i < src.length; i++) {
        if (!lazyLoad.loaded[src[i]]) {
            var prefex = '';
            if (!src[i].match(/^((https?:\/\/)|(\/))/)) {
                prefex = '/libraries/';
            }
            if (src[i].match(/(^[^.]+$|\.js$)/)) {
                lazyLoad.loaded[src[i]] = $.ajax({
                    url: prefex + (src[i].match(/\.js$/) ? src[i] : src[i] + '.js'),
                    dataType: 'script',
                    cache: true
                });
            }
            if (src[i].match(/(^[^.]+$|\.css$)/)) {
                $('<link rel="stylesheet" type="text/css" />').attr('href', prefex + (src[i].match(/\.css$/) ? src[i] : src[i] + '.css')).appendTo('head');
            }
        }
        deferreds.push(lazyLoad.loaded[src[i]]);
    }

    // Add ready event
    if (ready) {
        deferreds.push($.Deferred(function(deferred) {
            $(deferred.resolve);
        }));
    }

    // Bind callback
    if (callback) {
        $.when.apply($, deferreds).done(function() {
            callback.apply(window, context);
        });
    }
};

// Loaded modules
lazyLoad.loaded = {};
