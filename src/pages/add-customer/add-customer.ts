import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../shared/postServices';
import { CustomerDTO } from '../../shared/customerDTO';


@IonicPage()
@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html',
})
export class AddCustomerPage {

  customer: CustomerDTO;
  private addCustomerForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public viewCtrl: ViewController, private postService: PostService, public loadingCtrl: LoadingController,
    public ToastCtrl: ToastController) {
    this.addCustomerForm = this.formBuilder.group({
      CardName: [null, Validators.required],
      Phone1: ['+966', Validators.required],
      Address: [null],
      E_Mail: [null],
      BirthDate: [null]
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  onAddCustomer() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.customer = this.addCustomerForm.value
    this.postService.addNewCustomer(this.customer).subscribe(response => {
      if (response.CardCode && response.CardCode != null) {
        this.customer.CardCode = response.CardCode;
        loader.dismiss();
        this.viewCtrl.dismiss(this.customer);
      } else {
        loader.dismiss();
        this.showError();
      }
    }, err => {
      loader.dismiss();
      this.showError();
    });
  }
  showError() {
    let toast = this.ToastCtrl.create({
      message: 'حدث خطأ، رجاء أعد المحاولة لاحقا',
      position: "middle",
      showCloseButton: false,
      duration: 2000,
      dismissOnPageChange: true
    });
    toast.present();
  }
}
