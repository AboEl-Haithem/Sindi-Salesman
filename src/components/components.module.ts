import { NgModule } from '@angular/core';
import { ItemRowComponent } from './item-row/item-row';
import { IonicModule } from 'ionic-angular';
import { CustomerDetailsComponent } from './customer-details/customer-details';
@NgModule({
	declarations: [ItemRowComponent,
    CustomerDetailsComponent],
	imports: [IonicModule.forRoot([ItemRowComponent, CustomerDetailsComponent])],
	exports: [ItemRowComponent,
    CustomerDetailsComponent]
})
export class ComponentsModule {}
