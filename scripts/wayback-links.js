// Contains URIs of web archives that should be excluded from wayback links.
// This list includes base URIs of web archives that rewrite wayback urls.
// If unsure, do not edit.
var WLWebArchiveBaseUriToExclude = [
    "https?://web.archive.org/*"
];

// schema.org attributes to support
var WLSchemaOrgAttributes = {
    "date-published": "",
    "date-modified": ""
}

const WLURL = "https:"+"//web.archive.org/web/";

var WLLastOpen;

if (typeof WLuriPatternsToExclude === 'undefined') {
    WLuriPatternsToExclude = [
        "https?://archive.org*"
    ]
}

// Helper function to provide indexOf for Internet Explorer
if (!Array.prototype.indexOf) {
Array.prototype.indexOf = function(item) {
    var i = this.length;
    while (i--) {
        if (this[i] === item) return i;
    }
    return -1;
}
}

// Determining what is a URL. In this case, either a relative path or a HTTP/HTTPS scheme.
function WLIsURL(href) {
    var WLhasHTTPRegexp = /^https?:/;
    var WLhasColonRegexp = /:/;
    return Boolean(href) && (WLhasHTTPRegexp.test(href) || !WLhasColonRegexp.test(href));
}

// Creates a pseudorandom unique ID
function WL_ID() {
    return 'WL_' + Math.random().toString(36).substr(2, 9);
};

// Appends creates a list-item link to `uri` with `text` and appends it to `parent`
function WL_appendHiddenLink(parent, text, uri) {
    var listItem = document.createElement('li');
    var linkItem = document.createElement('div');
    var listLink = document.createElement('a');
    listLink.setAttribute('class', 'waybackLinks WLItem');
    listLink.href = uri;
    listLink.innerHTML = text;
    listLink.setAttribute('target', '_blank');

    linkItem.appendChild(listLink);
    listItem.appendChild(linkItem);
    parent.appendChild(listItem);
}

// Adds leading '0' to numbers
function WLAddZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Formats the dateStr in the aggregator format YYYYMMDDHHmmSS
function WLFormatDate(dateStr) {
    var date = new Date(dateStr);
    if(isNaN(date)){
        // Tires to fix the date before passing it to rigourous parsers (e.g. Mozilla)
        date = new Date(dateStr.replace(/ /g,'T'));
        if(isNaN(date)){
            return 'Invalid date';
        }
    }
    var datestring = '';
    datestring += date.getUTCFullYear();
    datestring += WLAddZero(date.getUTCMonth()+1);//  getMonth start at 0
    datestring += WLAddZero(date.getUTCDate());
    datestring += WLAddZero(date.getUTCHours());
    datestring += WLAddZero(date.getUTCMinutes());
    datestring += WLAddZero(date.getUTCSeconds());
    return datestring;
}

// Convert YYYYMMDDHHmmSS to YYYY-MM-DD HH:mm:SS
function WLParseDate(dateStr) {
    if (dateStr.length != 14) return null; 

    var datestring = '';
    datestring += dateStr.substr(0, 4) + "-";
    datestring += dateStr.substr(4, 2) + "-";
    datestring += dateStr.substr(6, 2) + " ";
    datestring += dateStr.substr(8, 2) + ":";
    datestring += dateStr.substr(10, 2) + ":";
    datestring += dateStr.substr(12, 2);

    return datestring;
}

// Formats the dateStr in the readable format MMMM nth, YYYY @ HH:mm:SS
function WLPrintDate(dateStr){
    var date = new Date(dateStr);
    if(isNaN(date)){
        date = new Date(dateStr.replace(/ /g,'T'));
        if(isNaN(date)){
            return 'Invalid date';
        }
    }
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    var datestring = '';
    datestring += monthNames[date.getUTCMonth()] + " ";
    datestring += nth(date.getUTCDate()) + ", ";
    datestring += date.getUTCFullYear() + " @ ";
    datestring += WLAddZero(date.getUTCHours()) + ":";
    datestring += WLAddZero(date.getUTCMinutes()) + ":";
    datestring += WLAddZero(date.getUTCSeconds());

    return datestring;
}

// Get nth of day
function nth(d) {
    if(d>3 && d<21) return d + 'th';
    switch (d % 10) {
          case 1:  return d + "st";
          case 2:  return d + "nd";
          case 3:  return d + "rd";
          default: return d + "th";
      }
  } 

// Extracts the domain name from an archive url.
function WLPrintDomainName(url) {
    var WLDomainRegExp = new RegExp('(?:https?://)?(?:www\\.)?((?:[A-Za-z0-9_\\.])+)(?:/.*)?','i');
    var match = url.match(WLDomainRegExp);
    if (match){
        if (match.length > 1) {
            var domain_name =  match[1];
            var max_length = 15;
            if (domain_name.length > max_length){
                return domain_name.substr(0, max_length) + '...';
            }
            return domain_name;
        }
    }
    return 'unknown archive';
}

// Return date string as YYYY-MM-DD HH:mm:SS format
function WLVersionDate(url) {
    url = "http://web.archive.org/web/20171112200853/http://iskme.org/";
    var WLVersionDateRegexp = /(https?:\/\/web.archive.org\/web\/)(\d*)(\/)/g;
    match = WLVersionDateRegexp.exec(url);
    if (match !== null && match.length == 4) {
        return WLParseDate(match[2]);
    } else {
        return null;
    }
}

// Keeps track of the last open menu to close it.
function WLCloseLastOpen(){
    if(WLLastOpen){
        WLLastOpen.setAttribute('aria-hidden', 'true');
        WLLastOpen = null;
    }
}

// Extracts information 
function WLGetAttribute(obj, str){
    try{
        // console.log(obj, str);
        return obj.getAttribute(str).trim();
    } catch(err) {
        return "";
    }
}

// Apply the script at the end of the loading.

    // Extracts page information
    var metas = document.getElementsByTagName("meta");
    var metaDates = {}

    for(var i=0; i<metas.length; i++) {
        var metaAttr = WLGetAttribute(metas[i], "item-prop");
        if (metaAttr in WLSchemaOrgAttributes) { 
            var mdate = WLGetAttribute(metas[i], "content");
            metaDates[metaAttr] = {"linkstr": "", "printstr": ""};
            metaDates[metaAttr]["linkstr"] = WLFormatDate(mdate);
            metaDates[metaAttr]["printstr"] = WLPrintDate(mdate);
        }
    }

    // For every <a> link
    var links = document.getElementsByTagName("a");
    for(var i=0; i<links.length; i++) {
        // Extracts link information
        var linkHREF =  WLGetAttribute(links[i], 'href');
        if (!linkHREF.search("http") == 0) {
            var loc = window.location;
            var abLink = loc.protocol + "//" + loc.host;
            if (!linkHREF.search("/|../|./") == 0) {
                abLink += "/";
            }
            linkHREF = abLink + linkHREF;
        }

        // The original is either in the attribute or in the href
        var original =  WLGetAttribute(links[i], 'data-original-url');
        var hasOriginal = Boolean(original);
        if (!hasOriginal){
            original = linkHREF;
        }
        // The memento url is either data-version-url or in the href if data-original-url exists
        var memento =  WLGetAttribute(links[i], 'data-version-url');
        var hasMemento = Boolean(memento);

        // The datetime is the data-versiondate
        var datetime = WLGetAttribute(links[i], 'data-version-date');
        var hasDatetime = Boolean(datetime);

        // Menu appearance conditions
        // Constructs the regular expression of restricted URIs from the baseRestrictedURI and the ones given in parameters
        var WLRestrictedRegexp = new RegExp('(?:'+WLuriPatternsToExclude.concat(WLWebArchiveBaseUriToExclude).join(')|(?:')+')');

        var showLink  = (links[i].href.length > 0 &&  // no inner/empty links
            (' ' + links[i].className+' ').indexOf(' waybackLinks ') < 0 &&  // not a link we created
            ((Object.keys(metaDates).length > 0 || hasOriginal || hasMemento || hasDatetime) && // one menu item at least
            ! WLRestrictedRegexp.test(linkHREF)) && // .href can be rewritten. but so is the regexp 
            WLIsURL(linkHREF));  // test the cleaned uri

        // console.log(hasOriginal, hasMemento, hasDatetime, ! WLRestrictedRegexp.test(linkHREF));

        if (showLink){
            var popupID = WL_ID();

            var waybackLinksElement = document.createElement('span');
            waybackLinksElement.setAttribute('role',"navigation");
            waybackLinksElement.setAttribute('aria-label', 'WLElement');

            // Only one menu (the arrow link)
            var outer = document.createElement('ul');
            var dropDownList = document.createElement('li');
            dropDownList.setAttribute('aria-label', 'WLOuter');
            var arrowDown = document.createElement('a');
            arrowDown.href = "";
            arrowDown.setAttribute('aria-haspopup', 'true');
            arrowDown.setAttribute('class', 'waybackLinks dropDownButton WLArrow');
            arrowDown.setAttribute('aria-controls', popupID);

            // The link glyph
            var linkChar = document.createElement('div');
            linkChar.setAttribute('class','waybackLinks dropDownButton WLIcon');

            // The dropdown menu
            var dropDownItem = document.createElement('ul');
            dropDownItem.setAttribute('class', 'WLMenu');
            dropDownItem.id = popupID;
            dropDownItem.setAttribute('aria-hidden', 'true');

            // Adds the title to the dropdown menu
            var listItem = document.createElement('li');
            listItem.setAttribute('class', 'WLTitle');
            listItem.innerHTML = 'Get from the Wayback Machine';
            dropDownItem.appendChild(listItem);

            // Adds the Menu Items to the dropdown menu
            for (metaAttr in metaDates) {
                var link = WLURL+metaDates[metaAttr]["linkstr"]+'/'+original;
                WL_appendHiddenLink(dropDownItem, WLSchemaOrgAttributes[metaAttr] + metaDates[metaAttr]["printstr"], link);
            }
            if(hasDatetime){
                var linkDateStr = WLFormatDate(datetime);
                var link = WLURL+linkDateStr+'/'+original;
                WL_appendHiddenLink(dropDownItem, WLPrintDate(datetime), link);
            }
            if(hasMemento){
                if (WLVersionDate(memento)) {
                    WL_appendHiddenLink(dropDownItem, WLPrintDate(WLVersionDate(memento)), memento);
                }
            }
            if(hasOriginal){
                WL_appendHiddenLink(dropDownItem, 'Get at current date', original);
                WL_appendHiddenLink(dropDownItem, 'Recent Version', 'https://web.archive.org/web/2/' + original);
                WL_appendHiddenLink(dropDownItem, 'First Version', 'https://web.archive.org/web/0/' + original);
            }

            dropDownList.appendChild(arrowDown);
            dropDownList.appendChild(dropDownItem);

            outer.appendChild(dropDownList);
            waybackLinksElement.appendChild(outer);

            arrowDown.parentNode.insertBefore(linkChar, arrowDown);

            // Adds the click function which toggles the aria-hidden Boolean
            arrowDown.onclick = function(e) {
                var region = document.getElementById(this.getAttribute('aria-controls'));
                var isClosed = region.getAttribute('aria-hidden') == 'true' ;
                WLCloseLastOpen();
                if (isClosed) {
                    region.setAttribute('aria-hidden', 'false');
                    WLLastOpen = region;
                } else { // region is expanded
                    region.setAttribute('aria-hidden', 'true');
                    WLLastOpen = null;
                }

                e.stopPropagation();

                return false;

            };

            // Insert the waybackLinks element directly after the link
            links[i].parentNode.insertBefore(waybackLinksElement, links[i].nextSibling);
        }

    }

    // Clicking anywhere closes the WLLastOpen menu item if it is present.
    document.onclick = WLCloseLastOpen;