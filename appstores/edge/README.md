## Microsoft Edge Store Submission Notes

- Please Update [Changelog](../changelog.md) and [Description](../description.md).

- Store ID: 0RDCKGF5PHSF
- Store URL: (pending)


### Notes

- [Microsoft Edge Add-ons Developer](https://developer.microsoft.com/en-us/microsoft-edge/extensions/)
- [Overview of Microsoft Edge extensions](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/)
- [Sign-in here](https://partner.microsoft.com/en-US/)
- [Publish a Microsoft Edge extension](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- [Add-ons store policies](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/store-policies/developer-policies)


### Feedback URL

- Since we don't yet have an extension in the store, our *Feedback Icon* and *Write a Review* URL defaults to the [contact page](https://archive.org/about/contact.php).
- Modify `feedbackURLs` in `utils.js` to include the Edge store link once it's available.


### Submit

https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension


#### 1. Start a new submission

To submit your extension to the store, you need to provide the following items:

- An archive (.zip) file that contains your code files.
- All required visual assets, which include a logo and small promotional tile.
- Optional promotional media, such as screenshots, promotional tiles, and a video URL.
- Information that describes your extension such as the name, short description, and a privacy policy link.

#### 2. Upload extension package

- Create a .ZIP file of the `webextension` directory. It must not include the directory name, and should not contain any `.DS_Store` or other hidden files, nor any hidden `__MACOSX/` directories which the Finder compress tool usually includes.
- If on a mac, run the following using Terminal, from within the `webextension` directory:
```
zip -r webext.zip . -x ".*" -x "*/.*"
```
- Then move ZIP file to another location on your computer outside of this repo.
- Verify that ZIP file is formatted correctly by testing in Edge.


#### 3. Provide Availability details

- Select `Public` or `Hidden`
- Markets: All 241 Markets


#### 4. Select Properties

- Category (required): Search Tools
  - "Productivity" has the most (2,000+) so may not be a good category to pick.
- Privacy policy requirements: Yes
- Privacy policy URL: https://internetarchive.github.io/wayback-machine-webextension/privacy-policy
- Website URL (optional): https://archive.org
- Support contact URL: https://archive.org/about/contact.php
- Mature content: No


#### 5. Add Store listing details

- Display Name: Wayback Machine
- [Description](../description.md).
- Extension Store Logo: 300x300 px (see images)
- Small promotional tile: (see images)
- Screenshots: (see images)
- Large promotional tile: (see images)
- YouTube video URL: none
- Short description: (stored in manifest)
- Search terms: max 7 terms and 21 words (see google doc)


#### 6. Complete submission

- Notes for certification:
  - Include test account user email and password.
  - If an update, include info about changes from prior version.

- May take up to 7 business days.
- For support email `ext_dev_support@microsoft.com`


### Images

- See [image assets](image-assets.md) for screenshot info.


#### Screenshot Captions

1. See how websites have changed through the history of the Web.
2. View archived copies of missing websites.
3. Instantly save the page you are currently viewing in the Wayback Machine.
4. View archived research papers and books referenced in Wikipedia.
5. See annotations for the current web page and domain provided by Hypothes.is.
