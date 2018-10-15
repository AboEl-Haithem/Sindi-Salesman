import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { GetService } from '../../shared/getServices';
import { PromotionsDTO } from '../../shared/promotionsDTO';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-promotions',
  templateUrl: 'promotions.html',
})
export class PromotionsPage implements OnInit {

  promotionsTypes: any[] = [];

  piecesOffers: PromotionsDTO[] = [];
  percentageOffers: PromotionsDTO[] = [];
  ValueOffers: PromotionsDTO[] = [];
  Add: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private getServices: GetService,
    public alertCtrl: AlertController, public viewCtrl: ViewController, public loadingCtrl: LoadingController
    , public ToastCtrl: ToastController, private storage: Storage) {
  }

  ngOnInit() {
    if (this.navParams.get('add')) {
      this.Add = true;
    }
    this.getPromotions();
  }
  getPromotions() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.storage.get('branchId').then(data => {
      this.getServices.GetPromotions(data).subscribe(response => {
        this.piecesOffers = response.filter(x => x.PromotionTypeID === 3);
        this.ValueOffers = response.filter(x => x.PromotionTypeID === 1);
        this.percentageOffers = response.filter(x => x.PromotionTypeID === 2);
        if (this.piecesOffers.length > 0) {
          this.promotionsTypes.push(this.piecesOffers);
        }
        if (this.ValueOffers.length > 0) {
          this.promotionsTypes.push(this.ValueOffers);
        }
        if (this.percentageOffers.length > 0) {
          this.promotionsTypes.push(this.percentageOffers);
        }
        loader.dismiss();
      }, err => {
        loader.dismiss();
        this.showError();
      });
    });
  }
  selectedPromotion(i, n) {
    if (this.Add == true) {
      let data = {
        Promotion: this.promotionsTypes[i][n]
      }
      this.viewCtrl.dismiss(data);
    } else {
      let alert = this.alertCtrl.create({
        title: this.promotionsTypes[i][n].PromotionTypeNameAr,
        subTitle: this.promotionsTypes[i][n].Description,
        buttons: ['اخفاء']
      });
      alert.present();
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
