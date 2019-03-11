import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, Events } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs';
import { GlobalsProvider } from '../../providers/globals/globals';

import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';


@Component({
	selector: 'page-fbprofile',
	templateUrl: 'fbprofile.html',
})
export class FbprofilePage {
	fbData: any;
	unit: string;
	userType: any;
	loading: any;
	firstName: any;
	lastName: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public event: Events, public globals: GlobalsProvider, public fcm: FCM, public storage: Storage) {
		this.fbData = this.navParams.get('fbdata');
		console.log("fbdata", this.fbData.uid);
		this.userType = 'owner';
		// this.userProfile = this.fbData.photoURL;
		var fullname = this.fbData.displayName;
		if (!(fullname.indexOf(' ') >= 0)) {
			this.firstName = fullname.substr(fullname.indexOf(' ') + 1);
			this.lastName = " ";
		} else {
			this.firstName = fullname.substr(0, fullname.indexOf(' '));
			this.lastName = fullname.substr(fullname.indexOf(' ') + 1);
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FbprofilePage');
	}

	back() {
		this.navCtrl.pop();
	}

	signupUser() {
		var createdAt = moment().format();
		var fcmToken = this.globals.fcmToken;
		var pwaDeviceToken = this.globals.pwaDeviceToken;
		var deviceToken;

		if (fcmToken != '') {
			deviceToken = fcmToken;
		} else if (pwaDeviceToken != '') {
			deviceToken = pwaDeviceToken;
		}
		else {
			deviceToken = 'default'
		}

		var userData = {
			email: this.fbData.email,
			firstName: this.firstName,
			lastName: this.lastName,
			displayName: this.fbData.displayName,
			createdAt: createdAt,
			profileurl: this.fbData.photoURL,
			uId: this.fbData.uid,
			userType: this.userType,
			unit: this.unit,
			deviceToken: deviceToken,
			hideProfile: false,
			blockedByMe: 'default',
			blockedMe: 'default',
			pushSound: 'default',
			showMessageNotification: true,
			showMessagePreview: true,
			subscribedNews: true
		};

		firebase.database().ref('/users').child(this.fbData.uid).set(userData).then(() => {
			console.log('Success');
			this.loading.dismiss().then(() => {

				console.log('Dismiss Work');
				// this.storage.set('FbLoginComplete', true);
				// this.event.publish('fbloggedin',true);
				this.globals.userData = userData;
				
				this.fcm.subscribeToTopic("news").then(() => {
					console.log('subscribed to news');
					this.storage.set('subscribedToNews', true);
					
					this.navCtrl.setRoot(TabsPage);
				}).catch((error) => {
					console.log('topic subscription error', error);
					this.loading.dismiss();
				});
				
			});

		}).catch((error) => {
			console.log('firebase error');
			this.loading.dismiss();
		});

		this.loading = this.loadingCtrl.create({ content: 'Updating Profile' });
		this.loading.present();

	}

}
