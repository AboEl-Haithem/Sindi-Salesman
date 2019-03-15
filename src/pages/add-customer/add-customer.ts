import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from '../../shared/postServices';
import { CustomerDTO } from '../../shared/customerDTO';

import { Connection } from '../../shared/connection';
import { HTTP } from '@ionic-native/http';


@IonicPage()
@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html',
})
export class AddCustomerPage {

  customer: CustomerDTO;
  addCustomerForm: FormGroup

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public viewCtrl: ViewController, private postService: PostService, public loadingCtrl: LoadingController,
    public ToastCtrl: ToastController, private http: HTTP, private connection: Connection) {
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
    this.customer = this.addCustomerForm.value;
    this.postService.addNewCustomer(this.customer).subscribe(response => {
      if (response.CardCode && response.CardCode != null) {
        this.customer.CardCode = response.CardCode;
        loader.dismiss();
        this.viewCtrl.dismiss(this.customer);
      } else if (response == "Exist") {
        loader.dismiss();
        this.showError('رقم الجوال موجود بالفعل');
      } else {
        loader.dismiss();
        this.showError('حدث خطأ، رجاء أعد المحاولة لاحقا');
      }
    }, err => {
      loader.dismiss();
      this.showError('حدث خطأ، رجاء أعد المحاولة لاحقا');
    });
    //////////////////
    /* this.http.setDataSerializer("json");
    this.http.post(`${this.connection.baseUrl}/Admin/CreateCustomer`, this.customer, {
      "content-type": "application/json",
      "Accept": 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
    }).then(data => {
      console.log('datttaaa', data);
      let resp = JSON.parse(data.data);
      if (resp.CardCode && resp.CardCode != null) {
        this.customer.CardCode = resp.CardCode;
        loader.dismiss();
        this.viewCtrl.dismiss(this.customer);
      } else if (resp == "Exist") {
        loader.dismiss();
        this.showError('رقم الجوال موجود بالفعل');
      } else {
        loader.dismiss();
        this.showError('حدث خطأ، رجاء أعد المحاولة لاحقا');
      }
    }).catch(err => {
      this.showError('حدث خطأ، رجاء أعد المحاولة لاحقا');
      loader.dismiss();
    }); */

    /////////////////
  }
  showError(msg) {
    let toast = this.ToastCtrl.create({
      message: msg,
      position: "middle",
      showCloseButton: false,
      duration: 2000,
      dismissOnPageChange: true
    });
    toast.present();
  }
}
