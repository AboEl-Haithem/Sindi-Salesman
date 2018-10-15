import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { ItemPage } from '../item/item';

import { GetService } from '../../shared/getServices';
import { ItemDTO } from '../../shared/itemDTO';

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage implements OnInit {
  items: ItemDTO[] = [];
  initializedItems: ItemDTO[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private getServices: GetService, public ToastCtrl: ToastController) {
  }
  ngOnInit() {
    this.getAllItems();
  }
  getPromotionItems() {
    let loader = this.loadingCtrl.create({
      cssClass: 'transperant_loader'
    });
    loader.present();
    this.getServices.GetPromotionItemsById(this.navParams.get('id')).subscribe(response => {
      this.items = this.initializedItems = response;
      loader.dismiss();
    });
  }
  getAllItems() {
    let loader = this.loadingCtrl.create({
      cssClass: 'transperant_loader'
    });
    loader.present();
    this.getServices.getAllItems().subscribe(response => {
      this.items = this.initializedItems = response;
      loader.dismiss();
    }, err => {
      loader.dismiss();
      this.showError();
    });
  }
  filterItems(event: any) {
    this.items = this.initializedItems;
    let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.ItemName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.ItemCode.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  viewItem(i) {
    let data = {
      itemSelected: true,
      id: this.items[i].ItemCode
    }
    this.viewCtrl.dismiss(data);
  }
  onDismiss() {
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
}
