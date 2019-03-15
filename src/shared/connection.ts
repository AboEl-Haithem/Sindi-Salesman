import { Injectable } from '@angular/core';

@Injectable()
export class Connection {
    baseUrl: string;

    constructor() {
        this.baseUrl = 'http://18.203.73.184:8060/api'
        /* this.baseUrl = 'http://192.168.137.1/CCOExtension.WebApp' */
        /* this.baseUrl = 'http://197.50.29.252/Sindi' */
        /* this.baseUrl = 'http://18.203.73.184/' */
        /* this.baseUrl = 'http://10.47.1.14:8090' */
    }
}
