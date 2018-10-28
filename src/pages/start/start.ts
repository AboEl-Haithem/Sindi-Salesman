import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { OrderPage } from '../order/order';
import { PromotionsPage } from '../promotions/promotions';
import { SearchOrdersPage } from '../search-orders/search-orders';


@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App,
  private storage: Storage) {
  }
  logout() {
    this.app.getRootNav().push(LoginPage);
    this.storage.clear();
  }
  order() {
    let data = {
      mode: 'new'
    }
    this.navCtrl.push(OrderPage, data);
  }

  promotions() {
    this.navCtrl.push(PromotionsPage);    
  }

  search() {
    this.navCtrl.push(SearchOrdersPage);    
  }
}
