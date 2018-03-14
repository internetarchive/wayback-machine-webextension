# Wayback Machine Google Chrome Extension

In cooperation with Google Summer of Code, The Internet Archive presents
The Official WayBack Machine Extension. With the power of the WayBack Machine,
we let you go in time to see how a URL has changed and evolved through the
history of the Web!

Original repo can be found at https://github.com/internetarchive/wayback-machine-chrome


## Recent Changes

- Added welcome page on installation (in order to analyze actual installations); currently set to http://archive.org/
- Added uninstallation page (to analyze uninstallations); currently set to https://blog.archive.org/2017/01/13/wayback-machine-chrome-extension-now-available/
- Cleaned URL sanitizer for current page's URL in JS (had some issues with Who-Is and Alexa window pop-ups).
- Added `wbm.js` and `wbm.css` for GUI cleaning.


## Future Plans

- Need to work on Alexa API for quick results
- Who-Is API for quick results
- Working on Archive.org themed UI.
- JavaScript optimization for quick pop-ups


## Places to update the version

- manifest.json - update version
- scripts/background.js - update header

## License

Copyright Internet Archive, 2017
AGPL-3
