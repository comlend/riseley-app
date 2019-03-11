import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, Events, Platform, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase';
import { FbprofilePage } from '../fbprofile/fbprofile';
import { TabsPage } from '../tabs/tabs';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FCM } from '@ionic-native/fcm';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashPage } from '../splash/splash';
import { FirstPage } from '../first/first';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  userProfile: any = null;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook, public loadingCtrl: LoadingController, public events: Events, public globals: GlobalsProvider, private fcm: FCM, public splashScreen: SplashScreen, private platform: Platform, private toastCtrl: ToastController) {
   
  }

  ionViewWillEnter() {
    // this.getDeviceToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.getDeviceToken();
  }
  register() {
    this.navCtrl.push(RegisterPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
  facebookLogin() {

    this.facebook.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);
      console.warn(facebookCredential);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          // console.log("Firebase success: " + JSON.stringify(success));
          this.userProfile = success;
          console.log('User Profile ', this.userProfile);
          this.loading.dismiss().then(() => {
            // this.navCtrl.push(FbprofilePage, { 'fbdata': this.userProfile });

            firebase.database().ref('/users/').once('value', (data) => {

              // console.log('User Exists ', data.child(this.userProfile.uid).exists());
              if (data.child(this.userProfile.uid).exists() == true) {

                var dbRef = firebase.database().ref('/users/' + this.userProfile.uid);
                var userArr = [];
                dbRef.once('value', (data) => {
                  console.log('data from fb login check',data.val());
                  this.globals.userData = data.val();
                  this.navCtrl.setRoot(FirstPage);
                });
               
                // this.events.publish('fbloggedin',true);
                // this.storage.set('FbLoginComplete', true);
                
              }
              else if (data.child(this.userProfile.uid).exists() == false) {
                // this.events.publish('fbloggedin', false);
                this.navCtrl.push(FbprofilePage, { 'fbdata': this.userProfile });
                this.globals.FbLoginComplete = false;
               
              }


            });

          });

        })
        .catch((error) => {
          this.loading.dismiss().then(() => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });

        });

    }).catch((error) => { console.log(error)
      this.loading.dismiss(); });
    this.loading = this.loadingCtrl.create({ content: 'Signing you in..' });
    this.loading.present();
  }

  getDeviceToken() {
    
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      var messaging = firebase.messaging();

      messaging.getToken().then((token) => {
        console.log('PWA Token => ', token);
        this.globals.pwaDeviceToken = token;

      }).catch((error) => {
        let toast = this.toastCtrl.create({
          message: 'There seems to be an issue with push notifications capabilities on this device. You might not be able to receive messages and notifications.',
          duration: 3000,
          position: 'top',
          dismissOnPageChange: true,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      });
    }

    else if (this.platform.is('ios') || this.platform.is('android')) {
      this.fcm.getToken().then(token => {
        console.log('Device Token ', token);
        this.globals.fcmToken = token;
        this.splashScreen.hide();
      }).catch((error) => {
        this.splashScreen.hide();
        let toast = this.toastCtrl.create({
          message: 'There seems to be an issue with push notifications capabilities on this device. You might not be able to receive messages and notifications.',
          duration: 3000,
          position: 'top',
          dismissOnPageChange: true
        });
        toast.present();
        
      });
    }
    else {
      this.splashScreen.hide();
    }
  }
}
