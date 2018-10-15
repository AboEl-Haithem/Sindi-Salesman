import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromotionOrderPage } from './promotion-order';

@NgModule({
  declarations: [
    PromotionOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(PromotionOrderPage),
  ],
})
export class PromotionOrderPageModule {}
