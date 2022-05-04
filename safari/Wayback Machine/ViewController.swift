//
//  ViewController.swift
//  Wayback Machine
//
//  Created by Carl on 9/4/21.
//

import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager

let appName = "Wayback Machine"
let extensionBundleIdentifier = "archive.org.waybackmachine.mac.extension"
let APP_VERSION = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0"

class ViewController: NSViewController {

    @IBOutlet weak var statusLabel: NSTextField!
    @IBOutlet weak var versionLabel: NSTextField!
    @IBOutlet weak var activateButton: NSButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        versionLabel.stringValue = "\(APP_VERSION)"

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if (state.isEnabled) {
                    self.statusLabel.stringValue = "Extension is On"
                    self.activateButton.title = "Open Preferences"
                } else {
                    self.statusLabel.stringValue = "Extension is Off"
                }
            }
        }
    }
    
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            //DispatchQueue.main.async {
            //    NSApplication.shared.terminate(nil)
            //}
        }
    }

}
