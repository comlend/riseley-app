import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServiceCenterPage } from '../service-center/service-center'; 
import { BuildingInfoPage } from '../building-info/building-info';
import { LiveLocalPage } from '../live-local/live-local';
import { SettingsPage } from '../settings/settings';
import { CreateEventPage } from '../create-event/create-event';
import { HouseRulePage } from '../house-rule/house-rule';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }
  buildingInfo(){
    this.navCtrl.push(BuildingInfoPage);
  }
  liveLocal(){
    this.navCtrl.push(LiveLocalPage);
  }
  serviceCenter(){
    this.navCtrl.push(ServiceCenterPage);
  }
  settings(){
    this.navCtrl.push(SettingsPage);
  }
  createEvent(){
    this.navCtrl.push(CreateEventPage);
  }
  houseRules(){
    this.navCtrl.push(HouseRulePage);
  }

}
