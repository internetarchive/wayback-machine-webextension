# Wayback Machine Google Chrome Extension

In cooperation with Google Summer of Code, The Internet Archive presents
The Official WayBack Machine Extension. With the power of the WayBack Machine,
we let you go in time to see how a URL has changed and evolved through the
history of the Web!

## Features

- Save Page Now: Instantly save the page you are currently viewing   in The
  WayBack Machine.
- Recent Version & First Version: Present the most recent, and the first
  version of a page, in the WayBack Machine.
- Alexa & Whois: Get analytical information about the page you are currently
  viewing, along with interesting facts, such as who owns it and how popular
  it is.
- Tweets: Search Twitter for information regarding your current page.
- Sitemap: Present a sunburst diagram for the domain you are currently viewing.
- Books: Check if referenced books are available to read in the Internet
  Archive.
- Papers: Check if referenced papers are available to read in the Internet
  Archive.
- TV news: Present archived TV news clips relevant to the current page.

## Installing Wayback Machine Chrome Extension

- For currently deployed version, go to the [chrome web store](https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak).
- Click on "Add to Chrome" button.
- It's done.

If you want to install the latest version, follow the steps below.

## Developing

Follow the given steps to install the extension on your local machine.

### Chrome
 
- Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox, hovering over **More Tools**  and selecting **Extensions**.
- Turn on the switch next to **Developer mode**.
- Click the **Load unpacked** button and select the `wayback-machine-chrome` directory that contains this code.

See [What are extensions?](https://developer.chrome.com/extensions) for more information on Chrome extensions.

### Firefox

- Open Firefox and navigate to `about:debugging` in the browser.
- Click **This Firefox**.
- Click **Load Temporary Add-on...**
- Open the `wayback-machine-chrome` directory and select any file.

See [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) for more information on Firefox extensions.

## Testing

To setup the testing environment, run `npm install` to install required packages.
This should create directory `node_modules` and populate it with modules.

To run tests, execute `npm test`.

When writing a test for `example.js`, create a new file in the test directory
named `example.spec.js`.

This has been tested using `node v10.11.0` and `npm 6.4.1`.

## Places to update the version

- manifest.json - update version

## License

Copyright © 2017-2020 Internet Archive, AGPL-3

## Credits

- Richard Caceres, @rchrd2
- Mark Graham, @markjohngraham
- Benjamin Mandel, @BenjaminMandel
- Kumar Yogesh, @kumarjyogesh
- Abhishek Das, @abhidas
- Vangelis Banos, @vbanos
- Rodden Kerry, @kerryrodden
- Anish Kumar Sarangi, @anishsarangi
- Max Reinisch, @MaxReinisch
- Carl Gorringe, @cgorringe
