var WALLA = { "id": "WALLA", "displayName": "walla.co.il", "initiators": ["walla"], "isVideoOwner": true, "patterns": ["walla", "img.wcdn"], "stealthMode": STEALTH_MODE[0], "enabled": true }
var MAKO = { "id": "MAKO", "displayName": "mako.co.il", "initiators": ["mako"], "isVideoOwner": true, "patterns": ["mako"], "stealthMode": STEALTH_MODE[0], "enabled": true }
var IL20 = { "id": "IL20", "displayName": "20il.co.il", "initiators": ["cdn.ch20-cdnwiz", "20il"], "isVideoOwner": false, "patterns": ["cdn.ch20-cdnwiz", "20il"], "stealthMode": STEALTH_MODE[0], "enabled": true }

var supportedSiteDefault = [WALLA, MAKO, IL20];
var supportedSite = supportedSiteDefault;

chrome.runtime.onStartup.addListener(function (details) {
    console.log("Extenstion Start");
    chrome.storage.local.clear(function () {
    })
});

chrome.runtime.onMessage.addListener(function (message, sender, handler) {

    if (message) {
        if (message.type == MESSAGE_GET_LIST) {
            chrome.storage.local.get(KEY_DATA, function (result) {
                if (result.data == undefined) {
                    chrome.storage.local.set({ [KEY_DATA]: JSON.stringify(supportedSite) });
                } else {
                    supportedSite = JSON.parse(result.data);
                }

                handler(supportedSite);

            });
        }

        if (message.type == MESSAGE_UPDATE_LIST) {
            if (message.payload != undefined) {
                supportedSite = message.payload;
                chrome.storage.local.set({ [KEY_DATA]: JSON.stringify(supportedSite) });
            }
        }
    }

    return true;
});

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {


        if (details.type != undefined) {



            for (var i = 0; i < supportedSite.length; i++) {

                if (isInitiator(details, supportedSite[i])) {
                    if (details.type == REQUEST_TYPE_MEDIA && supportedSite[i].stealthMode == STEALTH_MODE[0]) {
                        return checkUrl(details, supportedSite[i]);
                    } else if (supportedSite[i].stealthMode == STEALTH_MODE[1]) {
                        return checkUrl(details, supportedSite[i]);
                    }
                }

            }
        }

    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

function isSupportedSite(details, site) {

    var t = new URL(details.url);
    for (var i = 0; i < site.initiators.length; i++) {
        if (details.url.indexOf(site.initiators[i]) != -1) {
            return true;
        }
    }

    return false;
}

function isInitiator(details, site) {

    if (details.initiator != undefined) {

        for (var i = 0; i < site.initiators.length; i++) {
            var initiator = site.initiators[i];
            if (details.initiator.indexOf(initiator) != -1) {
                return true;
            } else {
                return false;
            }
        }
    }

    return false;
}

function checkUrl(details, site) {

    var t = new URL(details.url);

    for (var i = 0; i < site.patterns.length; i++) {
        var pattern = site.patterns[i];
        if (t.host.indexOf(pattern) != -1) {
            return undefined;
        }
    }

    console.log(details.initiator + " -> " + details.url);
    return { cancel: true };

}
