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

## Testing

To install testing packages, first run `npm init`, which will create a "node_modules" directory.

Next, run `npm install --save-dev mocha chai jsdom`.  This should install 3 packages to be used  in our unit testing, and place the packages in the node_modules directory.
There should already be an existing package.json file and a test directory in this github repository.  

When writing a test for `example.js`, create a new file in the test directory named `example.spec.js`.  [This](test/booklist.spec.js) is an example for how a test file should look.


## Places to update the version

- manifest.json - update version

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
- Anish Kumar Sarangi, @anishsarangi
- Max Reinisch, @Max
