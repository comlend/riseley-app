import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { HouseRuleDetailsPage } from '../house-rule-details/house-rule-details';
import * as _ from 'lodash';
/**
 * Generated class for the HouseRulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-house-rule',
  templateUrl: 'house-rule.html',
})
export class HouseRulePage {

  houseRules: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider) {
    this.firebase.getHouseRules().then((data) => {
      this.houseRules = data;
      this.houseRules = _.orderBy(this.houseRules, ['name'], ['asc']); 
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseRulePage');
  }
  back() {
    this.navCtrl.pop();
  }
  details(info) {
    this.navCtrl.push(HouseRuleDetailsPage, { detail: info });
  }

}
