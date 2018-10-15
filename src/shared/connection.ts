import { Injectable } from '@angular/core';

@Injectable()
export class Connection {
    baseUrl: string;

    constructor() {
        /* this.baseUrl = 'http://192.168.8.45/SindiPublish'*/
        this.baseUrl = 'http://197.50.29.252/Sindi'
        /* this.baseUrl = 'http://10.47.1.14:8090' */
    }
}