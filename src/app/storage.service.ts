import { Injectable } from '@angular/core';
declare var chrome;
declare var window;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private generateUUID() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getSetting(name: string, callback: (value: any) => void) {
    if (chrome.storage) {
      chrome.storage.local.get([name], (result => {
        callback(result[name]);
      }));
    } else {
      callback(window.localStorage.getItem(name));
    }
  }

  setSetting(name: string, value: any, callback: () => void) {
    if (chrome.storage) {
      var settings: Object = new Object();
      settings[name] = value;
      chrome.storage.local.set(settings, (result) => {
        window.console.log("got here");
        callback();
      });
    } else {
      window.localStorage.setItem(name, value);
      callback();
    }
  }

  getUUID(callback: (value: any) => void) {
    this.getSetting('uuid', (value: any) => {
      window.console.log('uuid=' + value);
      if (value == null) {
        value = this.generateUUID();
        this.setSetting('uuid', value, () => {});
      }
      callback(value);
    });

  }

}
