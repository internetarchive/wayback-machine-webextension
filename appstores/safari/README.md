## Apple App Store Submission Notes

### To prepare in Xcode

The following should already be set and nothing else need change.

Bundle IDs: `archive.org.waybackmachine.mac` & `archive.org.waybackmachine.mac.extension`

Both Targets "Wayback Machine" & "Wayback Machine Extension" should match.

Under "Signing & Capabilities" tab:

- [x] Automatically manage signing
- Team: Internet Archive
- Signing Certificate: Development
- App Sandbox: no checkboxes selected
- File Access: default 'none'


### Build & Upload to Store

First add new version in App Store Connect, then:

- Menu: Product > Archive
- Organizer: "Distribute App" button


### When selecting a build in App Store Connect

"Export Compliance Information"

- Uses Encryption? YES
- Qualify for Exemption? YES

