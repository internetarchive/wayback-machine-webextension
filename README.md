<img width="64px" align="left" src="webextension/images/app-icon/app-icon128.png">

# Wayback Machine Web Browser Extension

In cooperation with [Google Summer of Code](https://summerofcode.withgoogle.com), The [Internet Archive](https://archive.org) presents *The Official Wayback Machine Extension*. With the power of the Wayback Machine, we let you go back in time to see how a URL has changed and evolved through the history of the Web!

![screenshot](graphics/screenshots/popups.png)


## Features

- **Save Page Now** - Instantly save the page you are currently viewing in the Wayback Machine. Turn on *Auto Save Page* in settings to save pages that have not previously been saved.
- **Oldest, Newest &amp; Overview** - View the first version of a page or the most recently saved in the Wayback Machine. Or view a calendar overview of all archived pages.
- **Wayback Machine Count** - Display count of snapshots of the current page stored in the Wayback Machine.
- **Replace 404s, etc...** - When an error occurs, automatically check if an archived copy is available. Checks against 4xx &amp; 5xx HTTP error codes.
- **Contextual Notices** - Check for contextual information from fact checking organizations and origin websites.
- **Relevant Resources** - View research papers and books while visiting *Wikipedia*, archived digitized books while visiting *Amazon Books*, and recommended *TV News Clips* while visiting news websites.
- **URLs &amp; Collections** - Show a list of URLs captured under the current website, and what collections they are saved under.
- **Site Map &amp; Word Cloud** - Present a sunburst diagram for the domain you are currently viewing, or create a *Word Cloud* from the link's anchor text of the page you are on.
- **Annotations** - Provides a list of annotations for the current web page and domain, provided by [Hypothes.is](https://web.hypothes.is).
- **My Web Archive** - Save URLs to your public archive page on the Internet Archive.
- **Tweets &amp; Share Links** - Search Twitter for information regarding your current page, or share archived links on social media.


## Installing the Extension

Follow the link below to install the latest deployed version for your web browser.

| [![Chrome](webextension/images/about/chrome64.png)<br> Chrome](https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak) | [![Edge](webextension/images/about/edge64.png)<br> Edge](https://microsoftedge.microsoft.com/addons/detail/wayback-machine/kjmickeoogghaimmomagaghnogelpcpn) | [![Firefox](webextension/images/about/firefox64.png)<br> Firefox](https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/) | [![Safari](webextension/images/about/safari64.png)<br> Safari](https://apps.apple.com/us/app/wayback-machine/id1472432422?mt=12) |
| -- | -- | -- | -- |


## Provide Feedback

Your feedback helps us improve our web extension and is much appreciated!

If you have a GitHub account, please check the [list of existing issues](https://github.com/internetarchive/wayback-machine-webextension/issues) (bugs are tagged red), then create a **New issue** to file a Bug report or Feature request. We recommend that you test against the _Latest Build from Source_ (if able to) to see that any bugs discovered haven't already been fixed.

If you do not have an account, please send us an email to info@archive.org to report any bugs or feature requests. Please include the version of the web extension you are using (which you can find on the extension's About page) and what browser + version, and any other relevent info such as the website URL where the error occurs.


## Installing the Latest Build from Source

First tap on the **Code** button, **Download ZIP**, unzip the file in a location where you can find on your computer, then follow the steps below for your browser.

<img width="40px" align="left" src="webextension/images/about/chrome64.png">

### Chrome

1. Open Chrome and navigate to [chrome://extensions](chrome://extensions) in your browser. You can also access this page by clicking on the 3 vertical dots menu on the top-right, hovering over **More Tools**, then selecting **Extensions**.
2. Turn on the switch next to **Developer mode**.
3. Click the **Load unpacked** button and select the `wayback-machine-webextension/webextension` directory that contains this code.
4. Click on the *Extensions* puzzle-like icon in the toolbar.
5. Now click on the **Pin** icon next to *Wayback Machine* to pin it.
6. Click on the newly added icon.
7. Read the terms, then *Accept and Enable*. Click on the icon again to use the extension.

See [What are extensions?](https://developer.chrome.com/extensions) for more information on Chrome extensions.

<img width="40px" align="left" src="webextension/images/about/edge64.png">

### Edge

1. Open Edge and navigate to [edge://extensions](edge://extensions) in your browser. You can also access this page by clicking on the 3 horizontal dots menu on the top-right, then clicking **Extensions**.
2. Turn on the switch next to **Developer mode**.
3. Click the **Load unpacked** button and select the `wayback-machine-webextension/webextension` directory that contains this code.
4. Click on the newly added icon in the toolbar.
5. Read the terms, then *Accept and Enable*. Click on the icon again to use the extension.

<img width="40px" align="left" src="webextension/images/about/firefox64.png">

### Firefox

1. Open Firefox and navigate to [about:debugging](about:debugging) in the browser. You can also access this page by clicking on the hamburger menu on the top-right, select **Add-ons**, then the **Gear Tools button** on the top-right, then **Debug Add-ons**.
2. Click **This Firefox** on the left.
3. Click **Load Temporary Add-on...**
4. Open the `wayback-machine-webextension/webextension` directory and select any file.
5. Click on the newly added icon in the toolbar.
6. Read the terms, then *Accept and Enable*. Click on the icon again to use the extension.

See [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) for more information on Firefox extensions.

<img width="40px" align="left" src="webextension/images/about/safari64.png">

### Safari 14+

This will require Xcode to compile from source.

1. Open Safari.
   - If Develop menu is hidden, go to Preferences > Advanced > check "Show Develop menu in menu bar".
   - Then Develop menu > Allow Unsigned Extensions (enter password).
2. Open the project file `safari/Wayback Machine.xcodeproj` in Xcode. Click Play to run.
3. Follow directions in splash window:
   - Safari menu > Preferences > Extensions tab.
   - Check to activate Wayback Machine.
   - Select "Always Allow on Every Website..." button and confirm.
4. Click on the newly added icon in the toolbar.
5. Read the terms, then *Accept and Enable*. Click on the icon again to use the extension.


## Contributing Code

Thank you for your interest in contributing to this Open Source project! We welcome code contributions. Please read the following which should help you get started.

- [Contribution Guide](CONTRIBUTING.md)
- [Style Guide](STYLE_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)


## Renamed Repo

If you previously used the command line to clone this repo, note that it has been renamed. To update your local copy, run one of the following commands from the repo's directory.

*SSH:* `git remote set-url origin git@github.com:internetarchive/wayback-machine-webextension.git`

*HTTPS:* `git remote set-url origin https://github.com/internetarchive/wayback-machine-webextension.git`


## Credits

By order of lines contributed (with years):

- Carl Gorringe [@cgorringe](https://github.com/cgorringe) (2020-22)
- Abhishek Das [@abhidas17695](https://github.com/abhidas17695) (2017-18)
- Anish Kumar Sarangi [@anishsarangi](https://github.com/anishsarangi) (2018-22)
- Vangelis Banos [@vbanos](https://github.com/vbanos) (2017-19)
- Max Reinisch [@MaxReinisch](https://github.com/maxreinisch) (2018-19)
- Pushkit Kapoor [@tikhsuP](https://github.com/tikhsuP) (2020)
- Shubham Rath [@sr6033](https://github.com/sr6033) (2019)
- Tanweer Anwar [@tanweer919](https://github.com/tanweer919) (2019)
- Zerichen [@Zerichen](https://github.com/Zerichen) (2019)
- pranshukharkwal [@pranshukharkwal](https://github.com/pranshukharkwal) (2020)
- Chirag Vashist [@SerChirag](https://github.com/SerChirag) (2017)
- Kumar Yogesh [@kumarjyogesh](https://github.com/kumarjyogesh) (2017)
- Richard Caceres [@rchrd2](https://github.com/rchrd2) (2017)
- Kerry Rodden [@kerryrodden](https://github.com/kerryrodden)
- Karim Ratib [@infojunkie](https://github.com/infojunkie) (2021-22) - Manager
- Mark Graham [@markjgraham](https://github.com/markjgraham) - Director


## License

Copyright © 2017-2021 Internet Archive. All rights reserved.

Licensed under the terms of the [GNU Affero General Public License version 3 (AGPLv3)](LICENSE).
