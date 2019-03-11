import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SignupPage } from '../signup/signup';
import { GlobalsProvider } from '../../providers/globals/globals';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { TncPage } from '../tnc/tnc';
import { BlockedUsersListPage } from '../blocked-users-list/blocked-users-list';
import { NotificationsPage } from '../notifications/notifications';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  profileurl: any;
  userData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseProvider: FirebaseProvider, public app: App, public globals:GlobalsProvider) {
    this.userData = this.globals.userData;
    this.profileurl = this.globals.userData.profileurl;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewWillEnter(){
    this.profileurl = this.globals.userData.profileurl;
  }

  back(){
    this.navCtrl.pop();
  }
  logOut(){
    return new Promise((resolve, reject) => {
            this.firebaseProvider.logOut().then(() => {
              this.app.getRootNav().setRoot(SignupPage);
                // resolve();
              });
    });
  }

  editProfile(){
    this.navCtrl.push(EditProfilePage);
  }
  
  aboutPage(){
    this.navCtrl.push(TncPage);
  }

  TncPage(){
    this.navCtrl.push(TncPage);
  }

  privacyPage(){
    this.navCtrl.push(PrivacyPolicyPage);
  }

  blockUsers() {
    this.navCtrl.push(BlockedUsersListPage);
  }

  goToNotifications() {
    this.navCtrl.push(NotificationsPage);
  }
}
