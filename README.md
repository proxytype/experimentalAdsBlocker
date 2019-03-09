![alt text](https://github.com/proxytype/experimentalAdsBlocker/blob/master/assets/release.png)
      
I try to understand how ads blockers works, for doing this i need the help of the browser, the most friendly is chrome that supply full development environment without additional requirements.

The main idea is to hook the request before sending it to the server, chrome api provide a set of listeners to achieve this, so basically is pretty easy, for the experiment i took 4 major news israeli sites loaded with ads to see the effectiveness.
 
- Walla.co.il
- Mako.co.il
- 20il.co.il
- Ynet.co.il

The ads blocker support 2 kinds of filtering, the first is full isolation it’s mean that url that not match to set of patterns will be block , the second is filtering only commercial video content.

## Structure ##

**Id(string)** - name should be unique.

**displayName(string)** - the name to display in the popup.

**initiators(string[])** - the patterns of the main site, each pattern for site.

**patterns(string[])** - the patterns to search in requested url.

**stealthMode(string)** - VIDEO / ISOLATION.

## Conclusion ##

Mako, Walla, 20IL mostly affected, the commercial content come from 3rd party site, make it easy to detect while Ynet store all the content under the main domain what make it much harder to know the relative content.

## Resources ##
https://developer.chrome.com/apps/about_apps
