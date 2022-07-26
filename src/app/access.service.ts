import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AccessUpdate } from './access-update';
import * as shajs from 'sha.js';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var chrome;

@Injectable({
    providedIn: 'root'
})
export class AccessService {
    version: string = chrome.runtime.getManifest ? chrome.runtime.getManifest().version : '0.0.0';

    constructor(private storageService: StorageService, private http: HttpClient) { }

    async getRequestParams() {
        let httpParams = new HttpParams();
        let uuid: string;
        let token: string;
        let counter: number;
        await Promise.all([
            this.storageService.getUUID().then(value => {uuid = value;}),
            this.storageService.getToken().then(value => {token = value;}),
            this.storageService.getCounter().then(value => {counter = value;})
        ]);
        counter++;
        await this.storageService.setCounter(counter);
        httpParams = httpParams.set('uuid', uuid);
        httpParams = httpParams.set('counter', counter.toString());
        if (token != null && token.length == 8) {
            let keyContent = uuid + "-" + token + "-" + counter;
            let key = shajs('sha256').update(keyContent).digest('hex');
            httpParams = httpParams.set('key', key);
        }
        return httpParams;
    }

    async register() {
        let params = await this.getRequestParams();
        params = params.set('name', 'kiosk');
        params = params.set('type', 'kiosk');
        params = params.set('product', 'signbits');
        params = params.set('vendor', 'Universal Bits');
        params = params.set('version', this.version);
        let options = { params: params };
        return this.http.get('https://animefest.org/api/v1/register', options);
    }

    async getKioskConfig() {
        let params = await this.getRequestParams();
        let options = { params: params };
        return this.http.get('https://animefest.org/api/v1/kiosk_config', options);
    }

    async getBadgeList(lastUpdateTime: string) {
        let params = await this.getRequestParams();
        params = params.set('lastUpdateTime', lastUpdateTime);
        let options = { params: params };
        return this.http.get<AccessUpdate>('https://animefest.org/api/v1/badge_list', options);
    }

    async addAccessLog(uid: string, location: string, block: number) {
        console.log("addAccessLog", uid, location, block);
        let params = await this.getRequestParams();
        params = params.set('uid', uid);
        params = params.set('location', location);
        if (block != null) {
            params.set('id_schedule_block', block.toString());
        }
        let options = { params: params };
        return this.http.get('https://animefest.org/api/v1/access_log', options).toPromise();
    }

}

