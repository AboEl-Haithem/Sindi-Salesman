import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { StartPage } from '../pages/start/start';

import { UserDTO } from '../shared/userDTO';
import { SearchOrdersPage } from '../pages/search-orders/search-orders';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  userDTO: UserDTO = {};

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage,
    public app: App) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.storage.get('userId').then(data => {
        if (data == null) {
          this.app.getRootNav().setRoot(LoginPage);
        }
        else {
          this.userDTO.userId = parseInt(data);
          /* this.app.getRootNav().setRoot(StartPage); */
          this.app.getRootNav().setRoot(SearchOrdersPage);
        }
      });
      statusBar.styleDefault();
      setTimeout(() => {
        splashScreen.hide();
      }, 500);
    });
  }
}

