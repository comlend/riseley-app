import { Component, NgZone, ViewChild } from '@angular/core';
import { Platform, Events, ToastController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignupPage } from '../pages/signup/signup';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../providers/globals/globals';
import { Storage } from '@ionic/storage';
// import * as _ from 'lodash';
// import * as moment from 'moment';
import { FCM } from '@ionic-native/fcm';
import { Badge } from '@ionic-native/badge';
import { FirstPage } from '../pages/first/first';
@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	@ViewChild('pageNav') nav: NavController;

	rootPage: any = '';
	fbLoginComplete: boolean = true;

	constructor(private platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen, private global: GlobalsProvider, public event: Events, private fcm: FCM, public _zone: NgZone, public badge: Badge, public toastCtrl: ToastController, public storage: Storage) {


		this.initializeFirebase();
		// this.fbLoginComplete = this.global.FbLoginComplete;

		platform.ready().then(() => {
			if (platform.is('core') || platform.is('mobileweb')) {
				this.global.cordovaPlatform = true;
				this.initializePwaNotification();
			}
			// this.initializeApp();

			if (platform.is('ios')) {
				this.global.cordovaPlatform = true;
				this.initializeFcmNotification();
			}

			else if (platform.is('android')) {
				this.global.cordovaPlatform = true;
				this.initializeFcmNotification();
			}

			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			// this.rootPage = SignupPage;
		});
	}

	initializeFirebase() {
		firebase.auth().onAuthStateChanged(user => {
			if (!user) {
				this.badge.clear();
				this.splashScreen.hide();
				console.log('this is if user is not logged in')
				this.rootPage = SignupPage;
				this.nav.setRoot(SignupPage);
				// unsubscribe();
				return;
			}

			else {
				this.global.userId = user.uid;
				if (this.global.FbLoginComplete) {

					// if (this.platform.is('core') || this.platform.is('mobileweb')) {
					// 	this.setupOnTokenRefresh();
					// }
					this.nav.setRoot(FirstPage);
					console.log('this is if user is logged in');

				}
				else if (!this.global.FbLoginComplete) {
					this.splashScreen.hide();
					return;
				}

			}

		});
	}
	// this is for ios and android apps
	initializeFcmNotification() {
		console.log('FCM Notification initialised');
		this.fcm.onNotification().subscribe(data => {
			console.log(data);
			this.storage.get('unreadMessages').then((val) => {
				// console.log('unread message is', val);
				var unreadMessages = val + 1;
				this.badge.set(unreadMessages);
				this.storage.set('unreadMessages', unreadMessages);
			});


			// alert(data.aps.alert.title);
			if (data.wasTapped) {
				this.badge.increase(1);
				console.log("Received in background");
			} else {
				console.log("Received in foreground");
				this.badge.clear();
				let toast = this.toastCtrl.create({
					message: data["notification"].title,
					duration: 3000,
					position: 'top',
					dismissOnPageChange: true
				});
				toast.present();
			};
		});

		this.fcm.onTokenRefresh().subscribe((token) => {
			var userId = this.global.userId;
			var dbRef = firebase.database().ref('/users').child(userId);

			dbRef.update({
				deviceToken: token
			}).then(() => {
				console.log('Device Token Updated Successfully');
			}).catch(() => {
				console.log('Device Token Update Error');
			});
		});


	}
	// this is for browser 
	initializePwaNotification() {
		var messaging = firebase.messaging();
		messaging.requestPermission().then(() => {
			console.log('Permission granted');

			messaging.onTokenRefresh(() => {
				this.updateToken();
				console.log("Token refreshed");
				// 	dbRef.update({
				// 		deviceToken: ''
				// 	}).then(() => {  });
			});
			messaging.onMessage((payload) => {
				console.log('Message received. ', payload);
				let toast = this.toastCtrl.create({
					message: payload["notification"].title,
					duration: 3000,
					position: 'top',
					dismissOnPageChange: true
				});

				// if (this.nav.getActive().name != 'TabsPage') {
				toast.present();
				// ...
			});
			// token might change - we need to listen for changes to it and update it
			// this.setupOnTokenRefresh();
			// return this.updateToken();
		});

	}
	updateToken() {
		var messaging = firebase.messaging();
		var userId = this.global.userId;
		var dbRef = firebase.database().ref('/users').child(userId);

		return messaging.getToken().then((currentToken) => {
			this.global.pwaDeviceToken = currentToken;

			if (currentToken) {
				// we've got the token from Firebase, now let's store it in the database
				dbRef.update({
					deviceToken: currentToken
				}).then(() => {
					console.log('Device Token Updated Successfully');
				}).catch(() => {
					console.log('Device Token Update Error');
				});
				return;
			} else {
				console.log('No Instance ID token available. Request permission to generate one.');
			}
		});
	}
	setupOnTokenRefresh() {
		var userId = this.global.userId;
		var dbRef = firebase.database().ref('/users').child(userId);
		var messaging = firebase.messaging();


		messaging.onTokenRefresh(() => {
			this.updateToken();
			console.log("Token refreshed");
		});
	}

}
