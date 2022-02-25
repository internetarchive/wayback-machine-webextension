## Chrome Store Submission Notes

- Please Update [Changelog](../changelog.md) (v3.0+) and [Description](../description.md).
- [Old Changelog](changelog-chrome.md).

- Store ID: fpnmgdkabkmnadcjpehmlllkndpkmiak
- Store URL: https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak

- [Developer Dashboard](https://chrome.google.com/webstore/devconsole/)

- May need to verify info. Go to upper left menu and select "Account".

- My need to set up 2FA (which should already be set up?)
  - https://www.google.com/landing/2step


### Notes

- [Updated Privacy Policy &amp; Secure Handling Requirements](https://developer.chrome.com/docs/webstore/user_data/)

- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish/)

- [Update your Chrome Web Store item](https://developer.chrome.com/docs/webstore/update/)


### Package

- Create a .ZIP file of the `webextension` directory. It must not include the directory name, and should not contain any `.DS_Store` or other hidden files, nor any hidden `__MACOSX/` directories which the Finder compress tool usually includes.
- If on a mac, run the following using Terminal, from within the `webextension` directory:
```
zip -r webext.zip . -x ".*" -x "*/.*"
```
- Then move ZIP file to another location on your computer outside of this repo.
- Verify that ZIP file is formatted correctly by testing in Chrome.

- On the Chrome Web Store Dashboard, select the "Upload new package" button.


### Store Listing

#### Product details

- Title: Wayback Machine
- Summary: (from manifest description)
- Description: see [description.md](../description.md)
- Category: Search Tools (currently listed in Our Top Picks)
- Language: English (United States)

#### Graphic assets

- Store icon: 128x128 PNG (96x96 + 16px padding) [app-icon128.png](app-icon128.png)
- Promo video: (none)
- Screenshots & Promo Tiles (see version directory)

#### Additional fields

- Official URL: (blank)
- Homepage URL: https://archive.org
- Support URL: https://archive.org/about/contact.php


### Privacy practices

- Privacy policy URL: https://internetarchive.github.io/wayback-machine-webextension/privacy-policy
- Old Archive Policy: https://archive.org/about/terms.php

#### Single purpose

To help provide context to people browsing the web.

#### Permission justification

Permissions used: `activeTab, cookies, contextMenus, notifications, storage, webRequest, webRequestBlocking, <all_urls>`

- activeTab: For using tabs.executeScript() to insert html content for error popups and wikipedia.
- cookies: Used in login authentication.
- contextMenus: For right-click shortcuts to common features.
- notifications: To notify users of initiation, completion, and error alerts while saving.
- storage: For storing settings, cache, and other persistent data.
- webRequest: To detect http fail codes such as 404 Not Found.
- webRequestBlocking: To use onBeforeSendHeaders to rewrite http headers.
- Host permission: Need access to all websites so that automatic http error detection will work.

- Are you using remote code? NO

#### Data usage

- [x] Personally identifiable info
- [ ] Health info
- [ ] Financial and payment info
- [x] Authentication info
- [ ] Personal communications
- [ ] Location
- [x] Web history
- [ ] User activity
- [x] Website content (When scanning for ISBNs on Wikipedia and Amazon pages.)

Certify:
- [x] I do not sell or transfer user date to third parties.
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes.

### Payments & distribution

- Payments: Free
- Visibility: Public
- Percentage rollout: 100%
- Distribution: All Regions


### Images

- See [image assets](image-assets.md) for info on screenshots &amp; promo images.
