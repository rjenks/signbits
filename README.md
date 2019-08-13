# Signbits

Signbits is a Chrome OS Kiosk App for digital signage at World Fandom events.  It is built using the Angular framework.  It will not run in a regular browser tab.  It uses Chrome APIs which require it to run as an App on a Chrome OS device.  Specifically we use Chromebit devices connected to large screen TVs in portrait orientation.

## Development

* Install NodeJS version 10.16 or greater and NPM version 6.10 or greater
* Clone this project and open a terminal in the project folder.
* Run `npm install` to install the necessary development tools.
* Run `ng build --prod` to compile the code to the dist\ folder.
* Open a browser on a Chromebook and go to the Extensions view (Menu -> More Tools -> Extensions)
* Enable developer mode
* Click `Load Unpacked` and select the signbits\dist\signbits folder
* Run the App from the Chrome App launcher

You can use `ng build --prod --watch` to build continuously each time a file is changed, but you will need to reload the extension for the changes to be picked up.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Enrolling a Chromebit to use the Chrome Kiosk license.
* Start with a factory reset Chrome device.  If a user has ever logged in on the device you will need to factory reset it to clear all existing profiles before continuing.
* Boot the device to the login screen, but DO NOT login
* Press Ctrl+Alt+E to enter the Enrollment form
* Follow the instructions from there.

## Configuring Chromebit that is in Kiosk mode

* Connect a keyboard and mouse to the Chromebit
* Reboot the Chromebit
* Hit Ctrl+Alt+S on the keyboard when you see the ScreenCloud launches
* It should enter desktop mode where you can change the config (e.g. Connect to a Wifi network)
* Reboot the device to go back into Kiosk mode
