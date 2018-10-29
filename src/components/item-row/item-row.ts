import { Component, Input } from '@angular/core';
import { ItemDTO } from '../../shared/itemDTO';

@Component({
  selector: 'item-row',
  templateUrl: 'item-row.html'
})
export class ItemRowComponent {

  @Input() item: ItemDTO = {};
}
