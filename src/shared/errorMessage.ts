import { Injectable } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';

@Injectable()
export class ErrorMessage {
    constructor(private ToastCtrl: ToastController) { }

    errMsg(message) {
        let toast = this.ToastCtrl.create({
            message: message,
            position: "middle",
            showCloseButton: false,
            duration: 2000,
            dismissOnPageChange: true
        });
        toast.present();
    }
}