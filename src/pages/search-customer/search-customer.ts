import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { CustomerDTO } from '../../shared/customerDTO';

import { GetService } from '../../shared/getServices';
import { ErrorMessage } from '../../shared/errorMessage';

@IonicPage()
@Component({
  selector: 'page-search-customer',
  templateUrl: 'search-customer.html',
})
export class SearchCustomerPage {
  customers: CustomerDTO[];
  customer: CustomerDTO;
  customersNames: string[];
  findCustomerOption: any = 'mob';
  searchValue: string = '+966';
  countryCode: string = '+966';
  searchName: string;
  viewCustomerDetails: boolean = false;
  showSpinner: boolean = false;
  GetCustomer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private getServices: GetService, public errorMessage: ErrorMessage, public loadingCtrl: LoadingController
    , public ToastCtrl: ToastController) {
  }

  getCutomersByName(ev: any) {
    if (this.GetCustomer != null) {
      this.GetCustomer.unsubscribe();
    }
    this.showSpinner = true;
    this.viewCustomerDetails = false;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.customersNames = [];
      this.GetCustomer = this.getServices.GetCustomerByName(val).subscribe(response => {
        if (response.Availability === "Not Exist") {
          this.customersNames.push("الاسم غير موجود");
        } else if (response.Response == "Error") {
          let toast = this.ToastCtrl.create({
            message: 'حدث خطأ، رجاء أعد المحاولة لاحقا',
            position: "middle",
            showCloseButton: false,
            duration: 2000,
            dismissOnPageChange: true
          });
          toast.onDidDismiss(() => {
            this.viewCtrl.dismiss();
          });
          toast.present();
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
      this.showSpinner = false;
      this.customersNames = [];
    }
  }
  selectedCustomer(i) {
    if (this.customersNames[i] !== "الاسم غير موجود") {
      this.customer = this.customers.filter(x => x.CardName == this.customersNames[i])[0];
      this.searchName = this.customer.CardName;
      /*this.customer.BirthDate = this.convertDate(this.customer.BirthDate);*/
      this.customersNames = [];
      this.viewCustomerDetails = true;
    }
  }
  onChange() {
    this.customer = {};
    this.viewCustomerDetails = false;
    this.searchName = "";
    this.searchValue = "";
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  addNewCustomer() {
    let data = {
      newCustomer: true
    }
    this.viewCtrl.dismiss(data);
  }

  submitSearch() {
    let loader = this.loadingCtrl.create();
    loader.present();
    switch (this.findCustomerOption) {
      case 'mob': {
        this.getServices.getCustomerByPhone(parseInt(this.searchValue)).subscribe(response => {
          if (response.Response) {
            loader.dismiss();
            this.showError();
          } else if(response.Availability == 'Not Exist') {
            loader.dismiss();
              let toast = this.ToastCtrl.create({
                message: 'هذا الرقم غير موجود!',
                position: "middle",
                showCloseButton: false,
                duration: 2000,
                dismissOnPageChange: true
              });
              toast.present();
          } else {
            this.viewCustomerDetails = true;
            this.customer = response;
            /*this.customer.BirthDate = this.convertDate(this.customer.BirthDate);*/
            this.saveCustomer();
            loader.dismiss();
          }
        }, err => {
          loader.dismiss();
          this.showError();
        });
        break;
      }
      case 'code': {
        this.getServices.GetCustomerByCode(this.searchValue).subscribe(response => {
          if (response.Response) {
            loader.dismiss();
            this.showError();
          } else if(response.Availability == 'Not Exist') {
            loader.dismiss();
              let toast = this.ToastCtrl.create({
                message: 'هذا الكود غير موجود!',
                position: "middle",
                showCloseButton: false,
                duration: 2000,
                dismissOnPageChange: true
              });
              toast.present();
          } else {
            this.viewCustomerDetails = true;
            this.customer = response;
            /*this.customer.BirthDate = this.convertDate(this.customer.BirthDate);*/
            this.saveCustomer();
            loader.dismiss();
          }
        }, err => {
          loader.dismiss();
          this.showError();
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  convertDate(bDate) {
    let dateString = bDate.substr(6);
    let currentTime = new Date(parseInt(dateString));
    let month = currentTime.getMonth() + 1;
    let day = currentTime.getDate();
    let year = currentTime.getFullYear();
    let date = day + "/" + month + "/" + year;
    return date;
  }
  saveCustomer() {
    this.viewCtrl.dismiss(this.customer);
  }
  showError() {
    let toast = this.ToastCtrl.create({
      message: 'حدث خطأ، رجاء أعد المحاولة لاحقا',
      position: "middle",
      showCloseButton: false,
      duration: 2000,
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      this.viewCtrl.dismiss();
    });
    toast.present();
  }
}
