import { Component, OnInit } from '@angular/core';
import {
  IonicPage, NavController, ToastController, NavParams, AlertController,
  ViewController, LoadingController, ModalController, ActionSheetController
} from 'ionic-angular';

import { GetService } from '../../shared/getServices';
import { ItemDTO } from '../../shared/itemDTO';
import { OrderItem } from '../../shared/orderItem';
import { PromotionsDTO } from '../../shared/promotionsDTO';
import { CalcPromotion } from '../../shared/promotionsDTO';

import { ItemPage } from '../item/item';
import { PromotionItemsPage } from '../promotion-items/promotion-items';

interface FixedPrice {
  FabricCtId: number;
  Id: number;
  FabricCtName: string;
  Price: number;
}

@IonicPage()
@Component({
  selector: 'page-promotion-order',
  templateUrl: 'promotion-order.html',
})
export class PromotionOrderPage {

  selectedItems: OrderItem[] = [];
  promotion: PromotionsDTO;
  disableSaveBtn: boolean = true;
  disableAddDesigns: boolean = false;
  subTotal: number;
  valuePromotionFixedPrice: FixedPrice[];
  promotionTotalPrice: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public viewCtrl: ViewController, private getServices: GetService, public modalCtrl: ModalController
    , public ToastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    if (this.navParams.data.mode == 'edit') {
      this.selectedItems = this.navParams.data.items;
      this.promotion = this.navParams.data.Promotion;
      if (this.promotion.PromotionTypeID == 2 ||
        (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber == null)) {
        this.disableAddDesigns = false;
        this.disableSaveBtn = false;
      }
      else if ((this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber != null) ||
        (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber == null) ||
        (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber != null)) {
        this.disableAddDesigns = true;
        this.disableSaveBtn = false;
      }
    }
    this.promotion = this.navParams.data.Promotion;
    if (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber == null) {
      console.log('1/1');
    }
    if (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber != null) {
      console.log('1/2');
      this.getServices.GetAllPromotionFabrics().subscribe(response => {
        this.valuePromotionFixedPrice = response;
      });
    }
    if (this.promotion.PromotionTypeID == 2) {
      console.log('2');
    }
    if (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber == null) {
      console.log('3/1');
    }
    if (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber != null) {
      console.log('3/2');
    }
  }

  onAddDesign() {
    let data = {
      promotion: this.promotion
    }
    let modal = this.modalCtrl.create(PromotionItemsPage, data);
    modal.onDidDismiss(data => {
      if (data && data.add == true) {
        this.viewItem(data.id);
      }
    });
    modal.present();
  }

  viewItem(id) {
    let data = {
      promotion: this.promotion,
      id: id
    }
    let modal = this.modalCtrl.create(ItemPage, data);
    modal.onDidDismiss(data => {
      if (data) {
        this.calcPromotionPrice(data, "add");
      }
    });
    modal.present();
  }
  calcPromotionPrice(data, mode) {
    let item: OrderItem = data.item;
    item.PromotionID = this.promotion.PromotionID;
    item.PromotionTypeID = this.promotion.PromotionTypeID;
    if (mode == 'add') {
      this.selectedItems.push(item);
    }
    let last = this.selectedItems.length - 1;
    ///////////////////////Value Offers/////////////////////////
    /////BUY WITH 'X' AND PAY 'Y'///////
    if (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber == null) {
      this.selectedItems[last].PromotionPrice = this.selectedItems[last].TotalPrice;
      this.subTotal = 0;
      this.selectedItems.forEach(item => {
        this.subTotal += item.TotalPrice;
      });
      if (this.subTotal > this.promotion.PromotionFixedPrice) {
        // CALCULATE ITEMS PRICES//
        debugger;
        let total: number = 0;
        let percentage: number = 0;
        this.selectedItems.forEach(item => {
          total += item.ItemPrice;
        });
        percentage = (total - this.promotion.PromotionTotalPrice) / total;
        this.selectedItems.forEach(item => {
          item.PromotionPrice = ((item.ItemPrice * percentage) + item.UrgentCost + item.LogoPrice) * item.Count;
        });
        this.disableSaveBtn = false;
        this.promotionTotalPrice = this.subTotal - this.promotion.PromotionTotalPrice;
      }
    }
    ////////////////////////////////////
    /////BUY 'N' ITEMS AND PAY 'Y'/////
    if (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber != null) {
      this.selectedItems[last].PromotionPrice = this.selectedItems[last].TotalPrice;
      if (this.selectedItems.length == this.promotion.PromotionItemNumber) {
        this.disableSaveBtn = false;
        this.disableAddDesigns = true;
        // CALCULATE ITEMS PRICES//
        let total: number = 0;
        let percentage: number = 0;
        this.selectedItems.forEach(item => {
          total += item.ItemPrice;
        });
        percentage = this.promotion.PromotionTotalPrice / total;
        this.selectedItems.forEach(item => {
          //adding execlusive fabric fixed price//
          let fixedPrice: number = 0;
          if (item.FabricTypeID == 128) {
            this.valuePromotionFixedPrice.forEach(element => {
              if (element.FabricCtId == 128) {
                fixedPrice = element.Price;
              }
            });
          }
          //adding private fabric fixed price//
          else if (item.FabricTypeID == 127) {
            this.valuePromotionFixedPrice.forEach(element => {
              if (element.FabricCtId == 127) {
                fixedPrice = element.Price
              }
            });
          }
          //adding Limited fabric fixed price//
          else if (item.FabricTypeID == 126) {
            this.valuePromotionFixedPrice.forEach(element => {
              if (element.FabricCtId == 126) {
                fixedPrice = element.Price
              }
            });
          }
          item.PromotionPrice = (item.ItemPrice * percentage) + fixedPrice + item.UrgentCost + item.LogoPrice;
        });
      }
    }
    ///////////////////////Value Offers End/////////////////////////
    ///////////////////////Percentage Promotion/////////////////////
    if (this.promotion.PromotionTypeID == 2) {
      this.disableSaveBtn = false;
      this.selectedItems[last].PromotionPrice = ((this.selectedItems[last].HigherPrice * (100 - this.promotion.PromotionInvoiceDiscount) / 100) + this.selectedItems[last].UrgentCost + this.selectedItems[last].LogoPrice) * this.selectedItems[last].Count;
    }
    /////////////////////PiecesOffers/////////////////////
    if (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber != null) {
      this.selectedItems[last].PromotionPrice = this.selectedItems[last].TotalPrice;
      if (this.promotion.PromotionFreeItemNumber + this.promotion.PromotionMaxItemNumber == this.selectedItems.length) {
        this.disableSaveBtn = false;
        this.disableAddDesigns = true;
        /*let ItemsPrices: number[] = [];
        this.selectedItems.forEach(item => {
          ItemsPrices.push(item.TotalPrice);
        });
        ItemsPrices.sort((a, b) => a - b);
        for (let i = 0; i < this.promotion.PromotionFreeItemNumber; i++) {
          let item: OrderItem;
          for (let i = 0; i < this.selectedItems.length; i++) {
            if (this.selectedItems[i].TotalPrice == ItemsPrices[i]) {
              this.selectedItems[i].PromotionPrice = 0;
            }
          };
        }*/
        this.selectedItems.sort((a, b) => a.TotalPrice - b.TotalPrice);
        for (let i = 0; i < this.promotion.PromotionFreeItemNumber; i++) {
          this.selectedItems[i].PromotionPrice = 0;
        }
      }
    }

    if (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber == null) {
      this.selectedItems[last].PromotionPrice = this.selectedItems[last].TotalPrice;
      if (this.promotion.PromotionMaxItemNumber == this.selectedItems.length) {
        this.disableSaveBtn = false;
        this.disableAddDesigns = true;
        this.selectedItems.sort((a, b) => a.TotalPrice - b.TotalPrice);
        for (let i = 0; i < this.promotion.PromotionItemsToPaid; i++) {
          this.selectedItems[i].PromotionPrice = 0;
        }
      }
    }
  }
  itemAction(i) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'تعديل',
          handler: () => {
            this.editItem(i);
          }
        },
        {
          text: 'حذف',
          handler: () => {
            this.deleteConfirm(i);
          }
        },
        {
          text: 'إلغاء',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  editItem(i) {
    let data = {
      edit: true,
      item: this.selectedItems[i],
      promotion: this.promotion
    }
    let modal = this.modalCtrl.create(ItemPage, data);
    modal.onDidDismiss(data => {
      if (data) {
        this.selectedItems.splice(i, 1);
        this.selectedItems.push(data.item);
        this.calcPromotionPrice(data, 'edit');
      }
    });
    modal.present();
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
  deleteConfirm(i) {
    let alert = this.alertCtrl.create({
      message: 'هل تريد حذف الصنف؟',
      buttons: [
        {
          text: 'إلغاء',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'تأكيد',
          handler: () => {
            this.selectedItems.splice(i, 1);
            if (this.selectedItems.length == 0) {
              this.disableSaveBtn = true;
            }
            if (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber == null) {
              this.subTotal = 0;
              this.selectedItems.forEach(item => {
                this.subTotal += item.TotalPrice;
              });
              if (this.subTotal < this.promotion.PromotionFixedPrice) {
                this.disableSaveBtn = true;
              }
            }
            if ((this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber != null) ||
              (this.promotion.PromotionTypeID == 3 && this.promotion.PromotionFreeItemNumber == null)) {
              this.disableSaveBtn = true;
              this.disableAddDesigns = false;
            }
            if (this.promotion.PromotionTypeID == 1 && this.promotion.PromotionItemNumber != null) {
              this.disableSaveBtn = true;
              this.disableAddDesigns = false;
            }
          }
        }
      ]
    });
    alert.present();
  }
  onSave() {
    let totalPrice: number = 0;
    this.selectedItems.forEach(item => {
      totalPrice += item.PromotionPrice
    });
    this.selectedItems.forEach(item => {
      item.PromotionTotalPrice = totalPrice
    });
    let data: CalcPromotion = {
      promotion: this.promotion,
      items: this.selectedItems,
      totalPrice: totalPrice
    }
    this.viewCtrl.dismiss(data);
  }
}
