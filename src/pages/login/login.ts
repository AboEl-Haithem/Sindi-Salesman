import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { PostService } from '../../shared/postServices';
import { ErrorMessage } from '../../shared/errorMessage';
import { HTTP } from '@ionic-native/http';

import { StartPage } from '../start/start';
import { Connection } from '../../shared/connection';
import { LoginDto } from '../../shared/loginDTO';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginForm: FormGroup;
  loginDto: LoginDto;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, private postService: PostService, private storage: Storage,
    private ToastCtrl: ToastController, public app: App, public errorMessage: ErrorMessage, private http: HTTP, private connection: Connection) {
    this.loginForm = this.formBuilder.group({
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  onLogin() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.loginDto = {
      Username: this.loginForm.value.userName,
      Password: this.loginForm.value.password
    }
    /* this.http.setDataSerializer("json");
    console.log(this.connection.baseUrl);
    this.http.post(`${this.connection.baseUrl}/LogOn/LogInMobile`, this.loginDto, {
      'Content-Type': 'application/json'
    }).then(data => {
      let resp = JSON.parse(data.data);
      console.log('data', resp);
      if (resp.check === true) {
        this.storage.set('userId', resp.Id);
        this.storage.set('branchId', resp.branch);
        this.navCtrl.setRoot(StartPage);
        loader.dismiss();
      }
      else {
        let message = "خطأ باسم المستخدم أو كلمة المرور";
        this.errorMessage.errMsg(message);
        loader.dismiss();
      }
    }).catch(err => {
      console.log('err2', JSON.stringify(err));
      this.errorMessage.errMsg('حدث خطأ، رجاء أعد المحاولة لاحقا');
      loader.dismiss();
    }); */

    
     this.postService.login(this.loginDto).subscribe(data => {
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
      console.log('err', JSON.stringify(err));
      this.errorMessage.errMsg('حدث خطأ، رجاء أعد المحاولة لاحقا');
      loader.dismiss();
    });
  }
} 
