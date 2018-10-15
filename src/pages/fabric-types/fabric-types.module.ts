import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FabricTypesPage } from './fabric-types';

@NgModule({
  declarations: [
    FabricTypesPage,
  ],
  imports: [
    IonicPageModule.forChild(FabricTypesPage),
  ],
})
export class FabricTypesPageModule {}
