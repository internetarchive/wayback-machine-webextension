## Firefox Add-ons Store Submission Notes

This process involves more steps than other browser app stores.


### Get Extension Signed

#### Info

- [Get your extension signed](https://extensionworkshop.com/documentation/publish/#get-your-extension-signed)

- [Signing and distributing your add-on](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)

- [Submitting an add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)

- [Getting started with web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)


#### Package Extension

- [Package your extension](https://extensionworkshop.com/documentation/publish/package-your-extension/)


- Create a .ZIP file of the `webextension` directory. It must not include the directory name, and should not contain any `.DS_Store` or other hidden files, nor any hidden `__MACOSX/` directories which the Finder compress tool usually includes.

- If on a mac, run the following using Terminal, from within the `webextension` directory:

```
zip -r webext.zip . -x ".*" -x "*/.*"
```
- Then move this ZIP file to another location outside the repo. Upload this to submit, or test it first inside Firefox.

- Verify that the ZIP file is formatted correctly. See [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).


#### Source Code Submission

- [Source code submission](https://extensionworkshop.com/documentation/publish/source-code-submission/)

- Make sure that all libraries included are non-minimized. Since we removed the webpack build step and no longer generate `build.js`, we no longer need to provide any build steps to the reviewer. The ZIP'd `webextension` should be good enough and not require a separate Source Code submission.


#### Submit Extension

- https://addons.mozilla.org/developers/addon/submit/

- To submit a new version, select the existing approved extension rather than adding a new one.

- The validation proccess will find the following issue: "Unsafe assignment to innerHTML". **This is OK**.

Answers to Questions:

- Which application is this version compatible with? [x] Firefox, [ ] Firefox for Android.

- Do You Need to Submit Source Code? [x] NO

- Release Notes: See [changelog.md](../changelog.md)

- Notes to Reviewer:
  - Provide a test username and password for reviewer to use!


### Store Metadata

Name: Wayback Machine

Add-on URL:
- https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/ (current URL)
- https://addons.mozilla.org/en-US/firefox/addon/wayback-machine (non-active URL)

- Note that the *current URL* is also listed in `about.html` and `scripts/utils.js`.

Summary:
- see [description.md](../description.md)

Leave blank:
- [ ] This add-on is experiemental
- [ ] This add-on requires payment...

Firefox categories:
- [x] Search Tools
- [x] Feeds, News & Blogging

Firefox for Android catagories:
- [x] My add-on doesn't fit into any of the categories

Support email: info@archive.org

Support website: https://archive.org/about/contact.php

License:

- [x] This add-on has a Privacy Policy

Notes to Reviewer:
- Provide a login account to reviewer.


### Images

- Upload `add-on-icon128.png` (will resize to 32x32, 64x64, 128x128)
- Upload screenshots under version's directory.

#### Screenshot Captions

TODO

