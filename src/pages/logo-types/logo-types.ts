import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { GetService } from '../../shared/getServices';
import {LogoDTO } from '../../shared/logoDTO';

interface LogoCategory {
  id?: number;
  name?: string;
  icon?: string;
  showDetails?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-logo-types',
  templateUrl: 'logo-types.html',
})
export class LogoTypesPage implements OnInit {

  logosDTO: LogoDTO[];
  initializedLogos: LogoDTO[];
  logoCategories: LogoCategory[] = [];
  selectedLogoType: string = '';
  searchApplied: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private getServices: GetService, public loadingCtrl: LoadingController, public ToastCtrl: ToastController) {
  }

  ngOnInit() {
    this.GetAllLogos();
  }
  
  GetAllLogos() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.getServices.GetAllLogo().subscribe(response => {
      this.logosDTO = this.initializedLogos = response;
      this.logosDTO.forEach(element => {
        this.logoCategories.push({
          id: element.LogoTypeID,
          name: element.LogoType,
          icon: 'ios-arrow-down',
          showDetails: false
        });
      });
      this.logoCategories = this.remove_duplicates(this.logoCategories);
      loader.dismiss();
    }, err => {
      loader.dismiss();
      this.showError();
  });
  }
  remove_duplicates(arr) {
    for (let  i = 0; i < arr.length - 1; i++ ) {
      if ( arr[i].name == arr[i+1].name ) {
        arr.splice(i, 1);
        i--;
      }
    }
    return arr;
  }
  saveItem() {
    let data = this.logosDTO.filter(type => type.LogoCode === this.selectedLogoType);
    this.viewCtrl.dismiss(data[0]);
  }
  dismiss() {
    this.viewCtrl.dismiss();
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
  filterLogos(event) {
    this.logosDTO = this.initializedLogos;
    let val = event.target.value;
    if (val && val.trim() != '') {
      this.searchApplied = true;
      this.logosDTO = this.logosDTO.filter((item) => {
        return (item.LogoName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.LogoCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.searchApplied = false;
    }
  }

  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-arrow-down';
    } else {
      data.showDetails = true;
      data.icon = 'ios-arrow-up';
    }
  }
  getSubCategories(id) {
    let subCategories = [];
    this.logosDTO.forEach(element => {
      if (element.LogoTypeID == id) {
        subCategories.push(element);
      }
    });
    return subCategories;
  }
}
