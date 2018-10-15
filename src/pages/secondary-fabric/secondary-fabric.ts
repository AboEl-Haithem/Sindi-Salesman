import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';

import { GetService } from '../../shared/getServices';
import { SecondaryFabricDTO } from '../../shared/secondaryFabricDTO';
import { ErrorMessage } from '../../shared/errorMessage';

@IonicPage()
@Component({
  selector: 'page-secondary-fabric',
  templateUrl: 'secondary-fabric.html',
})
export class SecondaryFabricPage implements OnInit {

  secondaryFabricDTO: SecondaryFabricDTO[];
  initializedFabrics: SecondaryFabricDTO[];
  selectedType: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private getServices: GetService, public loadingCtrl: LoadingController, public ToastCtrl: ToastController) {
  }

  ngOnInit() {
    this.getAllSUBFabric();
  }

  getAllSUBFabric() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.getServices.GetAllSUBFabric().subscribe(response => {
      this.secondaryFabricDTO = this.initializedFabrics = response;
      loader.dismiss();
    }, err => {
      loader.dismiss();
      this.showError();
    });
  }
  filterItems(event: any) {
    this.secondaryFabricDTO = this.initializedFabrics
    let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.secondaryFabricDTO = this.secondaryFabricDTO.filter((item) => {
        return (item.SecondryFabricName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  saveItem() {
    let data = this.secondaryFabricDTO.filter(type => type.SecondryFabricCode === this.selectedType);
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

}