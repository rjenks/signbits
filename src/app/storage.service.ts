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

  getSetting(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (chrome.storage) {
        chrome.storage.local.get([name], (result => {
          resolve(result[name]);
        }));
      } else {
        resolve(window.localStorage.getItem(name));
      }  
    });
  }

  setSetting(name: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (chrome.storage) {
        var settings: Object = new Object();
        settings[name] = value;
        chrome.storage.local.set(settings, (result) => {
          resolve();
        });
      } else {
        window.localStorage.setItem(name, value);
        resolve();
      }
    });
  }

  async getUUID() {
    let uuid = await this.getSetting('uuid');
    window.console.log('uuid=' + uuid);
    if (uuid == null) {
      uuid = this.generateUUID();
      await Promise.all([
        this.setUUID(uuid),
        this.setCounter(0),
        this.setToken(undefined)
      ]);
    }
    return uuid;
  }

  async setUUID(uuid: string) {
    await this.setSetting('uuid', uuid);
  }

  async getToken() {
    let token = this.getSetting('token');
    window.console.log('token=' + token);
    return token;
  }

  async setToken(token: string) {
    await this.setSetting('token', token);
  }

  async getCounter() {
    let counter = await this.getSetting('counter');
    if (counter == null) {
      counter = 0;
    }
    window.console.log('counter=' + counter);
    return counter;
  }

  async setCounter(counter: number) {
    await this.setSetting('counter', counter);
  }

  async getLastUpdateTime() {
    let lastUpdateTime = await this.getSetting('lastUpdateTime');
    if (lastUpdateTime == null) {
      lastUpdateTime = 0;
    }
    window.console.log('lastUpdateTime=' + lastUpdateTime);
    return lastUpdateTime;
  }
  
}
