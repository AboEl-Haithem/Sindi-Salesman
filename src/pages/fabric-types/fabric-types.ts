import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { GetService } from '../../shared/getServices';
import { FabricDTO } from '../../shared/fabricDTO';
import { ErrorMessage } from '../../shared/errorMessage';

interface FabricCategory {
  name?: string;
  icon?: string;
  showDetails?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-fabric-types',
  templateUrl: 'fabric-types.html',
})

export class FabricTypesPage implements OnInit {

  fabricsDTO: FabricDTO[];
  initializedfabrics: FabricDTO[];
  fabricCategories: FabricCategory[] = [];
  selectedFabricType: string = '';
  searchApplied: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private getServices: GetService, public loadingCtrl: LoadingController, public ToastCtrl: ToastController) {

  }

  ngOnInit() {
    this.GetAllFabric();
  }
  GetAllFabric() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.getServices.GetAllFabric().subscribe(response => {
      this.fabricsDTO = this.initializedfabrics = response;
      this.fabricsDTO.forEach(element => {
        this.fabricCategories.push({
          name: element.ListName,
          icon: 'ios-arrow-down',
          showDetails: false
        });
      });
      this.fabricCategories = this.remove_duplicates(this.fabricCategories);
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

  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-arrow-down';
    } else {
      data.showDetails = true;
      data.icon = 'ios-arrow-up';
    }
  }
  getSubCategories(name) {
    let subCategories = [];
    this.fabricsDTO.forEach(element => {
      if (element.ListName === name) {
        subCategories.push(element);
      }
    });
    return subCategories;
  }
  saveItem() {
    let data = this.fabricsDTO.filter(type => type.ItemCode === this.selectedFabricType);
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
  filterFabrics(event) {
    this.fabricsDTO = this.initializedfabrics;
    let val = event.target.value;
    if (val && val.trim() != '') {
      this.searchApplied = true;
      this.fabricsDTO = this.fabricsDTO.filter((item) => {
        return (item.ItemName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.ItemCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.searchApplied = false;
    }
  }
}
