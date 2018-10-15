import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { Connection } from '../shared/connection';

@Injectable()
export class PostService {

    constructor(private http: Http, private connection: Connection) {
    }

    login(userName, password) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        let data = {
            UserName: userName,
            Password: password
        }
        let params: URLSearchParams = this.serialize(data);
        return this.http.post(`${this.connection.baseUrl}/LogOn/LogInMobile`, params, options)
            .map(res => res.json());
    }
    orderRequest(orderReq) {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify(orderReq);
        return this.http.post(`${this.connection.baseUrl}/Promotions/saveOrder`, data, options)
            .map(res => res.json());
    }
    addNewCustomer(newCst) {    
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify(newCst);
        return this.http.post(`${this.connection.baseUrl}/Admin/CreateCustomer`, data, options)
            .map(res => res.json());
    }
 
    serialize(obj): URLSearchParams {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var element = obj[key];
                params.set(key, element);
            }
        }
        return params;
    }
}