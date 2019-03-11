import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Storage } from '@ionic/storage';
import { GlobalsProvider } from '../../providers/globals/globals';
import * as firebase from 'firebase';

@Component({
	selector: 'page-notifications',
	templateUrl: 'notifications.html',
})
export class NotificationsPage {
	subscribedToNews: boolean = false;
	sendMessageNotifications: boolean;
	showMessagePreview: boolean;
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public storage: Storage, public globals: GlobalsProvider) {
		this.sendMessageNotifications = this.globals.userData.showMessageNotification;
		this.showMessagePreview = this.globals.userData.showMessagePreview;
		this.subscribedToNews = this.globals.userData.subscribedNews;

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NotificationsPage');
	}
	back(){
		this.navCtrl.pop();
	}
	unsubscribeFromNews(){
		this.firebase.unsubscribeFromTopic().then((data)=>{
			
		});
	}
	subscribeToNews(){
		this.firebase.subscribeToTopic().then((data) => {

		});
	}
	changeSubscription(event){
		this.storage.set('subscribedToNews',event.value);
		this.globals.userData.subscribedNews = event.value;

		var userId = this.globals.userId;
		firebase.database().ref('/users/').child(userId).update({
			subscribedNews: event.value
		});

		if (event.value) {
			this.subscribeToNews();
		}
		else if (!event.value) {
			this.unsubscribeFromNews();
		}

	}
	changeMessageNotificationSettings(event){
		var userId = this.globals.userId;
		this.globals.userData.showMessageNotification = event.value;
		firebase.database().ref('/users/').child(userId).update({
			showMessageNotification: event.value
		});
	}

	changeMessagePreview(event){
		var userId = this.globals.userId;
		this.globals.userData.showMessagePreview = event.value;
		firebase.database().ref('/users/').child(userId).update({
			showMessagePreview: event.value
		});
	}

}
