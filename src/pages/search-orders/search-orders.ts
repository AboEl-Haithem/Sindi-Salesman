import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { OrderPage } from '../order/order';

import { CustomerDTO } from '../../shared/customerDTO';
import { GetService } from '../../shared/getServices';

@IonicPage()
@Component({
  selector: 'page-search-orders',
  templateUrl: 'search-orders.html',
})
export class SearchOrdersPage implements OnInit {

  customers: CustomerDTO[];
  customer: CustomerDTO; 
  customersNames: string[];
  findOrderOption: any = 'code';
  searchValue: string = '50169';
  searchName: string;
  showSpinner: boolean = false;
  GetCustomer: any; 
  searchMode: string = '3';
  orders: any[] = [];
  countryCode: string = '+966';
  emptySearch = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private getServices: GetService, public loadingCtrl: LoadingController
    , public ToastCtrl: ToastController, public modalCtrl: ModalController) {
  }

  ngOnInit() {
  }

  getByCutomerName(ev: any) {
    if (this.GetCustomer != null) {
      this.GetCustomer.unsubscribe();
    }
    this.showSpinner = true;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.customersNames = [];
      this.GetCustomer = this.getServices.GetCustomerByName(val).subscribe(response => {
        if (response.Availability === "Not Exist") {
          this.customersNames.push("الاسم غير موجود");
        } else if (response.Response == "Error") {
          this.showError();
        } else {
          this.customers = response;
          this.customers.forEach(customer => {
            this.customersNames.push(customer.CardName);
          });
        }
        this.showSpinner = false;
      }, err => {
        this.showError();
      });
    }
    else {

      this.customersNames = [];
    }
  }
  selectedCustomer(i) {
    if (this.customersNames[i] !== "الاسم غير موجود") {
      this.customer = this.customers.filter(x => x.CardName == this.customersNames[i])[0];
      this.searchValue = this.customer.CardName;
      this.searchName = this.customer.CardName;
      this.submitSearch()
      this.customersNames = [];
    }
  }
  onChange(event) {
    this.customer = {};
    this.searchValue = "";
    this.searchName = "";
  }
  onChangeSegment() {
    this.orders = [];
    this.emptySearch = false;
  }
  submitSearch() {
    let loader = this.loadingCtrl.create({
      cssClass: 'transperant_loader'
    });
    loader.present();
    let value;
    if (this.findOrderOption == 'phone') {
      value = parseInt(this.searchValue);
    } else {
      value = this.searchValue
    }
    this.getServices.GetSpecificOrder(value, this.findOrderOption, this.searchMode).subscribe(response => {
      this.orders = response;
      if (this.orders.length == 0) {
        this.emptySearch = true;
      }
      loader.dismiss();
    }, err => {
      this.showError();
      loader.dismiss();
    });
  }
  viewOrder(i) {
    if (this.orders[i].Edittable) {
      let data = {
        mode: 'edit',
        id: this.orders[i].SalesOrderID,
        data: this.orders[i]
      }
      let modal = this.modalCtrl.create(OrderPage, data);
      modal.present();
    }
  }
  showError() {
    let toast = this.ToastCtrl.create({
      message: 'حدث خطأ، رجاء أعد المحاولة لاحقا',
      position: "middle",
      showCloseButton: false,
      duration: 2000,
      dismissOnPageChange: false
    });
    toast.present();
  }
  onDismiss() {
    this.viewCtrl.dismiss();
  }
}
