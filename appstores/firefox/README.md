## Firefox Add-ons Store Submission Notes

This looks really complicated.

### Get Extension Signed

#### Info

- [Get your extension signed](https://extensionworkshop.com/documentation/publish/#get-your-extension-signed)

- [Signing and distributing your add-on](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)

- [Submitting an add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)

- [Getting started with web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)


#### Package Extension

- [Package your extension](https://extensionworkshop.com/documentation/publish/package-your-extension/)

- Remove any `.DS_Store` files under `webextension` and subdirectories.

- When creating a .ZIP file of `webextension`, it must not include the directory, but rather the `manifest.json` file must be in the root. On a mac, instead of right-clicking on `webextension`, simply select all the files and folders inside that directory, then right-click and "Compress".

- Above doesn't work because macOS will create a hidden `__MACOSX/` directory in ZIP file, which will be flagged.

- Verify that the ZIP file is formatted correctly. See [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).


#### Source Code Submission

- [Source code submission](https://extensionworkshop.com/documentation/publish/source-code-submission/)


#### Submit Extension

- https://addons.mozilla.org/developers/addon/submit/


### Store Metadata

Name: Wayback Machine

Add-on URL:
https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/
https://addons.mozilla.org/en-US/firefox/addon/wayback-machine

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

### Notes

#### Add-on submission checklist

Please verify the following points before finalizing your submission. This will minimize delays or misunderstanding during the review process:

- Include detailed version notes (this can be done in the next step).
- If your add-on requires an account to a website in order to be fully tested, include a test username and password in the Notes to Reviewer (this can be done in the next step).

The validation process found these issues that can lead to rejections:
- Unsafe assignment to innerHTML
- The Function constructor is eval.


