import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, URLSearchParams } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/map';

import { Connection } from '../shared/connection';

@Injectable()
export class PostService {

    constructor(private http: Http, private connection: Connection, private httpN: HTTP) {
    }

    login(loginDto) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify(loginDto);
        return this.http.post(`${this.connection.baseUrl}/LogOn/LogInMobile`, data, options)
            .map(res => res.json());
    }
    orderRequest(orderReq) {
        /* this.httpN.setDataSerializer("json");
        this.httpN.post(`${this.connection.baseUrl}/Promotions/saveOrder`, orderReq, {
            "content-type": "application/json",
            "Accept": 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
        }).then(data => {
            console.log('status5', data.status);
            console.log('orderReq', orderReq);
            console.log('url5', data.url);
            console.log('headers5', data.headers);
            console.log('data', data.data);
        }).catch(err => {
            console.log('err5', err);
            console.log('orderReqE', orderReq);
        }); */
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify(orderReq);
        return this.http.post(`${this.connection.baseUrl}/Promotions/saveOrder`, data, options)
        .map(res => res.json());
    }
    addNewCustomer(newCst) {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify(newCst);
        return this.http.post(`${this.connection.baseUrl}/Admin/CreateCustomer`, data, options)
            .map(res => res.json());
    }
  GetSpecificOrder(data) {
    return this.http.post(this.connection.baseUrl + '/Promotions/Getspecificorder', data)
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
