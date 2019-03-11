import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { MessagePage } from '../message/message';
/**
 * Generated class for the BusinessDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-business-details',
  templateUrl: 'business-details.html',
})
export class BusinessDetailsPage {
  businessData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
    this.businessData = this.navParams.get('business');
    console.log(this.businessData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessDetailsPage');
  }
  back() {
    this.navCtrl.pop();
  }
  message(){
    this.app.getRootNav().push(MessagePage, { 'neighbour': this.businessData });
  }

}
