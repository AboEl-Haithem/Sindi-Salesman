import { Component, OnInit } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ViewController,
  ModalController, LoadingController, ToastController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { FabricTypesPage } from '../fabric-types/fabric-types';
import { LogoTypesPage } from '../logo-types/logo-types';
import { SecondaryFabricPage } from '../secondary-fabric/secondary-fabric';

import { GetService } from '../../shared/getServices';
import { ItemDTO } from '../../shared/itemDTO';
import { FabricDTO } from '../../shared/fabricDTO';
import { OrderItem } from '../../shared/orderItem';
import { LogoDTO } from '../../shared/logoDTO';
import { BranchSettings } from '../../shared/branchSettings';
import { SecondaryFabricDTO } from '../../shared/secondaryFabricDTO';


@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage implements OnInit {
  itemDTO: ItemDTO = {};
  fabricsDTO: FabricDTO[];
  fabricCategories: string[] = [];
  fabricDTO: FabricDTO = {
    ItemName: 'اختر نوع القماش'
  };
  orderItem: OrderItem = {
    Count: 1,
    UrgentCost: 0,
    LogoPrice: 0,
    Urgent: false,
    Prova: false
  };
  logoDTO: LogoDTO = {
    LogoName: 'اختر الشعار'
  };
  secondaryFabricDTO: SecondaryFabricDTO = {
    SecondryFabricName: 'اختر القماش الفرعي'
  };
  branchSettings: BranchSettings = {};
  showCounter: boolean = true;
  disableLogoEdit: boolean = false;
  hideSecondaryFabric: boolean = false;
  delivaryDate: Date;
  metalLogo: number = 119;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private getServices: GetService, private storage: Storage, public modalCtrl: ModalController
    , public loadingCtrl: LoadingController, public ToastCtrl: ToastController) {

  }
  ngOnInit() {
    this.GetSettingByBranch();
    if (this.navParams.data.edit) {
      this.itemDTO.ItemCode = this.navParams.data.item.ItemCode;
    } else {
      this.itemDTO.ItemCode = this.navParams.get('id');
    }
    if (this.navParams.data.promotion && (
      (this.navParams.data.promotion.PromotionTypeID == 1 && this.navParams.data.promotion.PromotionItemNumber != null) ||
      (this.navParams.data.promotion.PromotionTypeID == 3 && this.navParams.data.promotion.PromotionFreeItemNumber == null) ||
      (this.navParams.data.promotion.PromotionTypeID == 3 && this.navParams.data.promotion.PromotionFreeItemNumber != null)
    )) {
      this.showCounter = false;
    }
  }
  getItemById(id) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.getServices.getItemById(id).subscribe(response => {
      if (response.Response == "Error") {
        loader.dismiss();
        this.showError();
      } else {
        this.itemDTO = response;
        this.orderItem.ItemCode = this.itemDTO.ItemCode;
        this.orderItem.ItemName = this.itemDTO.ItemName;
        this.orderItem.ItemPrice = this.itemDTO.Price;

        //////////////////////init logos////////////////////////
        if (this.itemDTO.LogoCode != null) {
          this.getServices.GetLogoByID(this.itemDTO.LogoCode).subscribe(response => {
            this.logoDTO = response;
            this.orderItem.LogoId = this.logoDTO.LogoCode;
            this.orderItem.LogoName = this.logoDTO.LogoName;
            this.orderItem.LogoTypeId = this.logoDTO.LogoTypeID
            if (this.logoDTO.LogoTypeID == this.metalLogo) {
              this.disableLogoEdit = true;
            }
          }, err => {
            loader.dismiss();
            this.showError();
          });
        }
        //////////////////////init logos////////////////////////
        //////////////////////init secondary fabric////////////////////////
        if (this.itemDTO.SecondryFabricID != null) {
          this.getServices.GetSUBFabricByID(this.itemDTO.SecondryFabricID).subscribe(response => {
            this.secondaryFabricDTO = response;
            this.orderItem.SecondaryFabricId = this.secondaryFabricDTO.SecondryFabricCode;
            this.orderItem.SecondaryFabricName = this.secondaryFabricDTO.SecondryFabricName;
          }, err => {
            loader.dismiss();
            this.showError();
          });
        } else {
          this.hideSecondaryFabric = true;
        }
        //////////////////////init secondary fabric////////////////////////        
        if (this.navParams.data.edit) {
          this.editItem();
        }
        loader.dismiss();
      }
    }, err => {
      loader.dismiss();
      this.showError();
    });
  }
  editItem() {
    this.orderItem = this.navParams.data.item;
    this.itemDTO.Price = this.orderItem.HigherPrice;
    this.fabricDTO.ItemName = this.orderItem.FabricName;
    this.fabricDTO.ItemCode = this.orderItem.FabricId;
    this.secondaryFabricDTO.SecondryFabricName = this.orderItem.SecondaryFabricName;
    this.secondaryFabricDTO.SecondryFabricCode = this.orderItem.SecondaryFabricId;
    this.fabricDTO.Price = this.orderItem.FabricPrice;
    this.logoDTO.LogoCode = this.orderItem.LogoId;
    this.logoDTO.LogoName = this.orderItem.LogoName;
    this.logoDTO.LogoTypeID = this.orderItem.LogoTypeId;
    ////////////////INIT LOGO IN EDIT MODE//////////////////
    if (this.itemDTO.LogoCode == null) {
      if (this.orderItem.LogoTypeId == this.metalLogo) {
        this.orderItem.LogoPrice = this.branchSettings.LogoPrice;
      }
    } else {
      this.getServices.GetLogoByID(this.itemDTO.LogoCode).subscribe(response => {
        let logo: LogoDTO = response;
        if (logo.LogoTypeID == this.metalLogo) {
          this.disableLogoEdit = true;
        }
      }, err => {
        this.showError();
      });
    }
    ////////////////INIT LOGO IN EDIT MODE//////////////////   
  }
  GetSettingByBranch() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.storage.get('branchId').then(data => {
      this.getServices.GetSettingByBranch(data).subscribe(response => {
        this.branchSettings = response;
        ///////////INIT THE ITEM////////////
        this.getItemById(this.itemDTO.ItemCode);
        ///////////INIT THE ITEM////////////        
        this.orderItem.ProvaDate = this.calcDates(this.branchSettings.NumOfBrovaDays);
        this.calcDelivaryDate();
        loader.dismiss();
      }, err => {
        loader.dismiss();
        this.showError();
      });
    });
  }

  saveItem() {
    const checkKidItems: string = this.itemDTO.ItemCode.substring(0, 2);
    if (this.orderItem.FabricPrice > this.orderItem.ItemPrice && checkKidItems !== 'K-') {
      this.orderItem.HigherPrice = this.orderItem.FabricPrice;
    } else {
      this.orderItem.HigherPrice = this.orderItem.ItemPrice;
    }
    this.orderItem.ItemType = this.transformItemType(this.itemDTO.ItemType);
    this.orderItem.piecePrice = this.orderItem.HigherPrice + this.orderItem.UrgentCost + this.orderItem.LogoPrice;
    this.orderItem.TotalPrice = this.orderItem.piecePrice * this.orderItem.Count;
    let data = {
      add: true,
      item: this.orderItem
    }
    this.viewCtrl.dismiss(data);
  }
  dismiss() {
    this.viewCtrl.dismiss()
  }
  openFabricItems() {
    let modal = this.modalCtrl.create(FabricTypesPage);
    modal.onDidDismiss(data => {
      this.itemDTO.Price = this.orderItem.ItemPrice;
      if (data && data !== null) {
        const checkKidItems: string = this.itemDTO.ItemCode.substring(0, 2);
        this.fabricDTO = data;
        if (this.fabricDTO.Price > this.itemDTO.Price && checkKidItems !== 'K-') {
          this.itemDTO.Price = this.fabricDTO.Price
        }
      }
      this.orderItem.FabricId = this.fabricDTO.ItemCode;
      this.orderItem.FabricPrice = this.fabricDTO.Price;
      this.orderItem.FabricName = this.fabricDTO.ItemName;
      this.orderItem.FabricTypeID = this.fabricDTO.CtTypeId;
    });
    modal.present();
  }
  openSecondaryFabricItems() {
    let modal = this.modalCtrl.create(SecondaryFabricPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.secondaryFabricDTO = data;
        this.orderItem.SecondaryFabricId = this.secondaryFabricDTO.SecondryFabricCode;
        this.orderItem.SecondaryFabricName = this.secondaryFabricDTO.SecondryFabricName;
      }
    });
    modal.present();
  }
  openLogoItems() {
    if (this.disableLogoEdit == false) {
      let modal = this.modalCtrl.create(LogoTypesPage);
      modal.onDidDismiss(data => {
        if (data) {
          this.logoDTO = data;
          if (this.logoDTO.LogoTypeID == this.metalLogo) {
            this.orderItem.LogoPrice = this.branchSettings.LogoPrice;
          } else {
            this.orderItem.LogoPrice = 0;
          }
          this.orderItem.LogoId = this.logoDTO.LogoCode;
          this.orderItem.LogoName = this.logoDTO.LogoName;
          this.orderItem.LogoTypeId = this.logoDTO.LogoTypeID;
        }
      });
      modal.present();
    } else {

    }
  }
  urgentToggle(event) {
    if (event.value == true) {
      this.orderItem.UrgentCost = this.branchSettings.UrgentDeliveryFees;
    }
    else {
      this.orderItem.UrgentCost = 0;
    }
    this.calcDelivaryDate();
  }
  calcDelivaryDate() {
    if (this.orderItem.Urgent == true) {
      this.delivaryDate = this.calcDates(this.branchSettings.NumOfurgentDeliveryDays);
    } else {
      this.delivaryDate = this.calcDates(this.branchSettings.NumOfDeliveryDays);
    }
  }
    calcDates(days) {
      let date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }
  transformItemType(type: string) {
    let id: number;
    switch (type) {
      case 'T': {
        id = 1;
        break;
      }
      case 'R': {
        id = 2;
        break;
      }
      case 'D': {
        id = 3;
        break;
      }
      case 'S': {
        id = 4;
        break;
      }
      case 'J': {
        id = 5;
        break;
      }
      case 'M': {
        id = 6;
        break;
      }
      default: {
        id = 7;
        break;
      }
    }
    return id;
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
  barCodeScan() {
    /*this.barcodeScanner.scan().then(barcodeData => {
      alert('Barcode data: '+ barcodeData.text);
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });*/
  }
}
