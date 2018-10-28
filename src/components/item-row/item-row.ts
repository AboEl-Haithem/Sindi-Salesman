import { Component } from '@angular/core';

/**
 * Generated class for the ItemRowComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-row',
  templateUrl: 'item-row.html'
})
export class ItemRowComponent {

  text: string;

  constructor() {
    console.log('Hello ItemRowComponent Component');
    this.text = 'Hello World';
  }

}
