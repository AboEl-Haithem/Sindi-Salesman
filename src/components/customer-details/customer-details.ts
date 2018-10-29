import { Component, Input } from '@angular/core';
import { CustomerDTO } from '../../shared/customerDTO';

/**
 * Generated class for the CustomerDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'customer-details',
  templateUrl: 'customer-details.html'
})

export class CustomerDetailsComponent {
  @Input() customer: CustomerDTO;


}
