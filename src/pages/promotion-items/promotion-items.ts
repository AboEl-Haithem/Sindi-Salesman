import { Component, OnInit } from '@angular/core';
import {
  IonicPage, NavController, ToastController, NavParams, AlertController,
  ViewController, LoadingController, ModalController, ActionSheetController
} from 'ionic-angular';

import { ItemPage } from '../item/item';

import { GetService } from '../../shared/getServices';
import { ItemDTO } from '../../shared/itemDTO';
import { OrderItem } from '../../shared/orderItem';
import { PromotionsDTO } from '../../shared/promotionsDTO';

@IonicPage()
@Component({
  selector: 'page-promotion-items',
  templateUrl: 'promotion-items.html',
})
export class PromotionItemsPage implements OnInit {

  items: ItemDTO[] = [];
  initializedItems: ItemDTO[] = [];
  selectedItems: OrderItem[] = [];
  promotion: PromotionsDTO;
  disableSaveBtn: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private getServices: GetService, public modalCtrl: ModalController
    , public ToastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.promotion = this.navParams.data.promotion;
    this.getPromotionItems(this.navParams.data.promotion.PromotionID);
  }

  getPromotionItems(id) {
    let loader = this.loadingCtrl.create({
      cssClass: 'transperant_loader'
    });
    loader.present();
    this.getServices.GetPromotionItemsById(id).subscribe(response => {
      this.items = this.initializedItems = response;
      loader.dismiss();
    }, err => {
      this.showError();
      loader.dismiss();
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
  onSelectItem(i) {
    let data;
    if (this.items[i].ItmsGrpCod == 104) {
      data = {
        addMain: true,
        id: this.items[i].ItemCode
      }
      this.viewCtrl.dismiss(data);
    } else {
      console.log('this.promotion', this.promotion);
      if (
        (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber != null) ||
        (this.promotion.PromotionTypeID == 3) 
      ) {
        data = {
          addMain: false,
          count: 1,
          item: this.items[i]
        }
        this.viewCtrl.dismiss(data);
      } else {
        const prompt = this.alertCtrl.create({
          message: "عدد القطع",
          inputs: [
            {
              name: 'count',
              type: 'number'
            },
          ],
          buttons: [
            {
              text: 'إلغاء',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'تم',
              handler: data => {
                data = {
                  addMain: false,
                  count: parseInt(data.count),
                  item: this.items[i]
                }
                this.viewCtrl.dismiss(data);
              }
            }
          ]
        });
        prompt.present();
      }
    }
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
  onDismiss() {
    this.viewCtrl.dismiss();
  }
}
