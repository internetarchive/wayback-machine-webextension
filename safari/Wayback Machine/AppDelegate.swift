//
//  AppDelegate.swift
//  Wayback Machine
//
//  Created by Carl on 9/4/21.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Insert code here to initialize your application
    }

    func applicationWillTerminate(_ notification: Notification) {
        // Insert code here to tear down your application
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    /// Called from the install app's help menu.
    @IBAction func openSupportWebsite(_ sender: Any) {
        NSWorkspace.shared.open(URL(string: "https://archive.org/about/contact.php")!)
    }

}
