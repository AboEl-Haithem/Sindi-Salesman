import { NgModule } from '@angular/core';
import { ItemRowComponent } from './item-row/item-row';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [ItemRowComponent],
	imports: [IonicModule.forRoot([ItemRowComponent])],
	exports: [ItemRowComponent]
})
export class ComponentsModule {}
