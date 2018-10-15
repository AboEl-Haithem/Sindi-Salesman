import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { PostService } from '../../shared/postServices';
import { ErrorMessage } from '../../shared/errorMessage';

import { StartPage } from '../start/start';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, private postService: PostService, private storage: Storage,
    private ToastCtrl: ToastController, public app: App, public errorMessage: ErrorMessage) {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  onLogin() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.postService.login(this.loginForm.value.userName, this.loginForm.value.password).subscribe(data => {
      console.log(data);
      if (data.check === true) {
        this.storage.set('userId', data.Id);
        this.storage.set('branchId', data.branch);
        this.navCtrl.setRoot(StartPage);
        loader.dismiss();
      }
      else {
        let message = "خطأ باسم المستخدم أو كلمة المرور";
        this.errorMessage.errMsg(message);
        loader.dismiss();
      }
    }, err => {
      this.errorMessage.errMsg('حدث خطأ، رجاء أعد المحاولة لاحقا');
      loader.dismiss();
    });
  }
}
