import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, App } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { AddLocalPage } from '../add-local/add-local';
import { MessagePage } from '../message/message';

/**
 * Generated class for the LiveLocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-live-local',
  templateUrl: 'live-local.html',
})
export class LiveLocalPage {
  locals: any;
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalsProvider, public events: Events, public zone: NgZone, public app: App) {
    this.initializeData();

    this.events.subscribe('localsupdated', () => {
      this.zone.run(() => {
        this.locals = this.global.locals;
      });
    });
  }
  initializeData() {
    this.userId = this.global.userId;
    this.locals = this.global.locals;

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LiveLocalPage');
  }

  back() {
    this.navCtrl.pop();
  }
  addLocal(){
    this.navCtrl.push(AddLocalPage);
  }
  goToMessage(localItem){
    this.app.getRootNav().push(MessagePage, { 'neighbour': localItem });
  }

}
