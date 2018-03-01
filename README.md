# Wayback Machine Google Chrome Extension

In cooperation with Google Summer of Code, The Internet Archive presents
The Official WayBack Machine Extension. With the power of the WayBack Machine,
we let you go in time to see how a URL has changed and evolved through the
history of the Web!

## Features

- Save Page Now: Allows you to instantly save the page you are currently viewing
  in The WayBack Machine.
- Recent Version & First Version: Presents the most recent, and the first version
  of a page, in the WayBack Machine.
- Alexa & Whois: gives analytical information about the page you are currently
  viewing, along with interesting facts, such as who owns it and how popular
  it is.
- Tweets: Searches Twitter For information Regarding your current page.
- Sitemap: Presents a sunburst diagram for the domain you are currently viewing.

## Developing

This is a "WebExtension". See https://developer.chrome.com/extensions


## Places to update the version

- manifest.json - update version
- scripts/background.js - update header


## License

Copyright Internet Archive, 2017
AGPL-3


## Credits

- Richard Caceres, @rchrd2
- Mark Graham, @markjohngraham
- Benjamin Mandel, @BenjaminMandel
- Kumar Yogesh, @kumarjyogesh
- Abhishek Das, @abhidas
- Vangelis Banos, @vbanos
- Rodden Kerry, @kerryrodden

## Updates
 - Updated popup.js and index.html file
 - Removed Whois Popup
 - Added JSON Api Based result filteration rather than opening popups
 - No third party Whois data API (You can host it yourself created using html_dom_parser.php) 
 - Own Hosted Whois API -> https://rohitcoder.cf/research/whois_api/?site=github.com
 
 ## A Step Towards GsoC2018 ;) 
