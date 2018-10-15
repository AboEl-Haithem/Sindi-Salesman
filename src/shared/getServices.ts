import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Connection } from '../shared/connection';

@Injectable()
export class GetService {

    constructor(private http: Http, private connection: Connection) {
    }
    getAllItems() {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetDesigns').map(res => res.json());
    }
    getItemById(ItemCode) {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetDesignByID?ItemCode='+ ItemCode).map(res => res.json());
    }
    getCustomerByPhone(phoneNumber) {
        return this.http.get(this.connection.baseUrl+'/Admin/GetCustomerByPhone?CardPhone='+ phoneNumber).map(res => res.json());
    }
    GetCustomerByCode(code) {
        return this.http.get(this.connection.baseUrl+'/Admin/GetCustomerByCode?CardCode='+ code).map(res => res.json());
    }
    GetCustomerByName(name) {
        return this.http.get(this.connection.baseUrl+'/Admin/GetCustomerByName?CardName='+ name).map(res => res.json());
    }
    GetSettingByBranch(id) {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetSettingByBranch?Id='+ id).map(res => res.json());
    }
    GetAllFabric() {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetAllFabric').map(res => res.json());
    } 
    GetAllLogo() {
        return this.http.get(this.connection.baseUrl+'/DeliverySetting/GetAllLogo').map(res => res.json());
    } 
    GetAllSUBFabric() {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetAllSUBFabric').map(res => res.json());
    } 
    GetPromotions(id) {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetPromotionsByBranch?id=' + id).map(res => res.json());
    }
    GetPromotionItemsById(id) {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetPromotionItemsById?Id=' + id).map(res => res.json());
    }
    GetLogoByID(id) {
        return this.http.get(this.connection.baseUrl+'/DeliverySetting/GetLogoByID?LogoID=' + id).map(res => res.json());
    }
    GetSUBFabricByID(id) {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetSUBFabricByID?FID=' + id).map(res => res.json());
    }
    GetSpecificOrder(keyWord, mode, flag) {
        return this.http.get(this.connection.baseUrl+'/Promotions/Getspecificorder?'+mode+'=' + keyWord+'&mode=' + mode +'&flag=' + flag).map(res => res.json());
    }
    GetAllPromotionFabrics() {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetAllPromotionFabrics').map(res => res.json());
    } 
    GetAllBranches() {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetAllBranches').map(res => res.json());
    } 
    getOrderItemsBySalesId(id) {
        return this.http.get(this.connection.baseUrl+'/Promotions/GetOrderItemsBySalesId?Id=' + id).map(res => res.json());
        }
}