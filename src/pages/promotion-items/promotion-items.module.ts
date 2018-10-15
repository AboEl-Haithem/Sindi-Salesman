import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromotionItemsPage } from './promotion-items';

@NgModule({
  declarations: [
    PromotionItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(PromotionItemsPage),
  ],
})
export class PromotionItemsPageModule {}
