
var sites = undefined;

$(document).ready(function () {
    console.log("popup loaded!");

    chrome.runtime.sendMessage({
        type: MESSAGE_GET_LIST,
    }, function (response) {

        console.log(response);
        if (response != undefined && response.length != 0) {
            sites = response;
            for (var i = 0; i < sites.length; i++) {           
                
                createElement(sites[i]);
               
                setTimeout(function (id) {
                    console.log(id);

                    $('#' + id).on('click', function (e) {
                        $(CLASS_FEATURE).not(PREFIX_MENU + e.currentTarget.id).css('display', 'none');
                        $(PREFIX_MENU + e.currentTarget.id).css('display', 'inline-block');

                        $(CLASS_EX_UI_MENU_IMG).not(PREFIX_IMG_MENU + e.currentTarget.id).attr('src', ASSET_MENU)
                        $(PREFIX_IMG_MENU + e.currentTarget.id).attr('src', ASSET_MENU_ON);
                    });

                    $(PREFIX_FEATURE_ISOLATION + id).on('click', function (e) {
                        var id = e.currentTarget.id.split("_")[2];
                        var site = getSiteByID(id);
                        if (site != undefined) {
                            if (site.stealthMode == STEALTH_MODE[0]) {
                                site.stealthMode = STEALTH_MODE[1];

                                $(PREFIX_FEATURE_VIDEO + id).attr('src', ASSET_TOGGLE_OFF);
                                $(PREFIX_FEATURE_ISOLATION + id).attr('src', ASSET_TOGGLE_ON);

                                chrome.runtime.sendMessage({
                                    type: MESSAGE_UPDATE_LIST,
                                    payload: sites
                                });
                            }
                           
                        }
                        
                    });

                    $(PREFIX_FEATURE_VIDEO + id).on('click', function (e) {
                        var id = e.currentTarget.id.split("_")[2];
                        var site = getSiteByID(id);

                        if (site != undefined) {

                            if (site.stealthMode == STEALTH_MODE[1]) {
                                site.stealthMode = STEALTH_MODE[0];

                                $(PREFIX_FEATURE_VIDEO + id).attr('src', ASSET_TOGGLE_ON);
                                $(PREFIX_FEATURE_ISOLATION + id).attr('src', ASSET_TOGGLE_OFF);

                                chrome.runtime.sendMessage({
                                    type: MESSAGE_UPDATE_LIST,
                                    payload: sites
                                });
                            }

                        }

                    });


                }, 0, sites[i].id);

            }
        }
    });
});

function createElement(site) {

    var template = $(TEMPLATE_ID).html();
    
    template = template.replace(PATTERN_ID, site.id);
    template = template.replace(PATTERN_DISPLAY, site.displayName);

    if (site.stealthMode == STEALTH_MODE[0]) {
        template = template.replace(PATTERN_FEATURE_VIDEO, ASSET_TOGGLE_ON);
        template = template.replace(PATTERN_FEATURE_ISOLATION, ASSET_TOGGLE_OFF);
    } else if (site.stealthMode == STEALTH_MODE[1]) {
        template = template.replace(PATTERN_FEATURE_VIDEO, ASSET_TOGGLE_OFF);
        template = template.replace(PATTERN_FEATURE_ISOLATION, ASSET_TOGGLE_ON);
    }

    $(CONTAINERS).html($(CONTAINERS).html() + template);

};

function getSiteByID(id) {

    if (sites != undefined) {
        for (var i = 0; i < sites.length; i++) {
            if (sites[i].id == id) {
                return sites[i];
            }
        }
    }

    return undefined;
}

