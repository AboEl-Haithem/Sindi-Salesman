import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { StartPage } from '../pages/start/start';
import { OrderPage } from '../pages/order/order';
import { PromotionsPage } from '../pages/promotions/promotions';
import { RepairPage } from '../pages/repair/repair';
import { SearchCustomerPage } from '../pages/search-customer/search-customer';
import { AddCustomerPage } from '../pages/add-customer/add-customer';
import { ItemsPage } from '../pages/items/items';
import { ItemPage } from '../pages/item/item';
import { FabricTypesPage } from '../pages/fabric-types/fabric-types';
import { SecondaryFabricPage } from '../pages/secondary-fabric/secondary-fabric';
import { PromotionItemsPage } from '../pages/promotion-items/promotion-items';
import { PromotionOrderPage } from '../pages/promotion-order/promotion-order';
import { SearchOrdersPage } from '../pages/search-orders/search-orders';
import { ComponentsModule } from '../components/components.module'

import { PostService } from '../shared/postServices';
import { Connection } from '../shared/connection';
import { GetService } from '../shared/getServices';
import { LogoTypesPage } from '../pages/logo-types/logo-types';
import { ErrorMessage } from '../shared/errorMessage';
import { ItemsTypes } from '../shared/items-types.pipe';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    StartPage,
    OrderPage,
    PromotionsPage,
    RepairPage,
    SearchCustomerPage,
    AddCustomerPage,
    ItemsPage,
    ItemPage,
    FabricTypesPage,
    LogoTypesPage,
    SecondaryFabricPage,
    PromotionItemsPage,
    PromotionOrderPage,
    ItemsTypes,
    SearchOrdersPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonIcon: 'ios-arrow-forward'
        },
        android: {
          backButtonIcon: 'ios-arrow-forward'
        }
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    StartPage,
    OrderPage,
    PromotionsPage,
    RepairPage,
    SearchCustomerPage,
    AddCustomerPage,
    ItemsPage,
    ItemPage,
    FabricTypesPage,
    LogoTypesPage,
    SecondaryFabricPage,
    PromotionItemsPage,
    PromotionOrderPage,
    SearchOrdersPage
  ],
  providers: [
    StatusBar,
    SplashScreen, BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, PostService, Connection, GetService, ErrorMessage,
    Storage
  ]
})
export class AppModule { }
