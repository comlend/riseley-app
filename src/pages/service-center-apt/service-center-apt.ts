import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewServiceReqAptPage } from '../new-service-req-apt/new-service-req-apt';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ServiceCenterAptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-service-center-apt',
  templateUrl: 'service-center-apt.html',
})
export class ServiceCenterAptPage {

  message: {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider) {
    this.getAptServiceReqMessage();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ServiceCenterAptPage');
  }
  back() {
    this.navCtrl.pop();
  }
  newRequest() {
    // this.navCtrl.push(ServiceCenter2Page);
    this.navCtrl.push(NewServiceReqAptPage);
  }
  getAptServiceReqMessage(){
    this.firebase.getAptServiceReqMessage().then((data)=>{
      this.message = data;
      console.log(data);
    })
  }

}
