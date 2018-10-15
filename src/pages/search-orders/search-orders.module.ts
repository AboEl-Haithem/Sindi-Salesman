import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchOrdersPage } from './search-orders';

@NgModule({
  declarations: [
    SearchOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchOrdersPage),
  ],
})
export class SearchOrdersPageModule {}
