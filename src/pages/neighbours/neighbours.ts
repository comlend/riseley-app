import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, App, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { MessagePage } from '../message/message';
import { BusinessDetailsPage } from '../business-details/business-details';
import * as _ from 'lodash';
import * as firebase from 'firebase';

import { EventDispatcherProvider } from '../../providers/event-dispatcher/event-dispatcher';

@Component({
	selector: 'page-neighbours',
	templateUrl: 'neighbours.html',
})
export class NeighboursPage {
	users: any;
	userId: any;

	hasBusiness: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public globals: GlobalsProvider, private app: App, public event: Events, public eventDispatcher: EventDispatcherProvider, public _zone: NgZone) {
		this.userId = this.globals.userId;
		// this.getAllNeighbours()
		this.event.subscribe('neighboursUpdated', () => {
			this._zone.run(() => {
				if (this.globals.neighboursData) {

					this.users = _.cloneDeep(this.globals.neighboursData);
					console.log('Users ', this.users);

					this.removeUsersWithHiddenProfile();
					this.removeUsersThatBlockedMe();
					this.removeUsersThatIBlocked();
					this.ifBusinessExists();
				}
			});
		});

		if (this.globals.neighboursData) {
			
			this.users = _.cloneDeep(this.globals.neighboursData);
			console.log('Users ', this.users);

			this.removeUsersWithHiddenProfile();
			this.removeUsersThatBlockedMe();
			this.removeUsersThatIBlocked();
			this.ifBusinessExists();
		}
	}

	// ionViewWillEnter() {
	// 	// Initialize add User Event
	// 	this.eventDispatcher.newUserAdded().then(() => {
	// 		// Listen for the app level Events
	// 		this.listenEventDispatcher();
	// 	});
	// }

	ionViewDidLoad() {
		console.log('ionViewDidLoad NeighboursPage');
	}
	getAllNeighbours() {
		this.firebase.getNeighbours().then((userData) => {
			this.users = userData;

			console.warn(this.users);
		}, error => {
			console.error(error);
		});
	}

	ifBusinessExists() {
		var hasBusiness = _.find(this.users, { 'userType': 'business' });
		console.log('HASBUSINESS => ', hasBusiness);
		if (hasBusiness) {
			this.hasBusiness = true;
		}
	}

	reinitialiseAllData() {
		var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
		Promise.all(promises).then((values) => {
			this.extractNeighbourData();

			/* this.getUserData();
			console.log('All data reinitialised');
			console.log('Neighbours Data', this.globals.neighboursData); */
			this.users = this.globals.neighboursData;
		}).catch((err) => {
			console.log('Promise.all reinitialised ', err);
		});
	}

	getUserData() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/' + userId);
			var userArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					userArr = data.val();
					this.globals.userData = userArr;
					// console.warn(this.globals.userData);
					resolve(userArr);
				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}
	getNeighbours() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/');
			var neighboursArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					neighboursArr = _.toArray(data.val());
					_.remove(neighboursArr, { 'uId': userId });

					// console.log('neighboursArray ', neighboursArr);
					this.globals.neighboursData = neighboursArr;
					resolve();

				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}
	getAllChats() {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			// console.log('User ID ', userId);
			var dbRef = firebase.database().ref('chats').child(userId);
			var chatArr = [];
			dbRef.once('value', (chats) => {
				var chatObj = chats.val();
				for (let chat in chatObj) {
					var chatObjTemp = {};

					chatObjTemp['receiver'] = chat;
					chatObjTemp['messages'] = [];
					if (chatObj.hasOwnProperty(chat)) {
						let chatElement = chatObj[chat];
						// console.log('Chat Eele ', chat, _.toArray(chatElement));

						chatObjTemp['messages'] = _.toArray(chatElement);
					}

					chatArr.push(chatObjTemp);
				}

				this.globals.chats = chatArr;
				resolve();
				// console.log('Chat Arr ', chatArr);
			});
		});
	}

	extractNeighbourData() {
		this.globals.neighboursData
		this.globals.chats

		for (let i = 0; i < this.globals.chats.length; i++) {
			let chat = this.globals.chats[i];
			let receiver = chat.receiver;

			for (let j = 0; j < this.globals.neighboursData.length; j++) {
				let eachNeighbour = this.globals.neighboursData[j];
				let neighbourId = eachNeighbour.uId;
				if (receiver == neighbourId) {
					chat.receiverData = eachNeighbour;

					break;
				}
			}

			// console.log('All Chats Modified ', this.global.chats);
		}
	}

	listenEventDispatcher() {
		// console.log('Listening For Events');
		this.event.subscribe('user:added', () => {
			// alert('New User Added');
			this.reinitialiseAllData();

			// this.event.unsubscribe('user:added');
		});
	}

	goToNeighbour(neighbour) {
		this.app.getRootNav().push(MessagePage, { 'neighbour': neighbour });
		// this.navCtrl.push();
	}
	goToBusiness(business) {
		this.app.getRootNav().push(BusinessDetailsPage, { 'business': business });
	}

	removeUsersWithHiddenProfile() {
		_.remove(this.users, {'hideProfile': true});
	}

	removeUsersThatBlockedMe() {
		var blockedMe = this.globals.userData.blockedMe;

		if (blockedMe != 'default') {
			var blockedMeUsers = _.toArray(blockedMe);

			console.log('Run Blocked Me', blockedMeUsers, this.globals.neighboursData);

			_.map(blockedMeUsers, (user) => {
				console.log('Blocked Me Users => ', user.id);
				_.remove(this.users, { 'uId': user.id });
			});	
		}
	}

	removeUsersThatIBlocked() {
		var iBlocked = this.globals.userData.blockedByMe;

		if (iBlocked != 'default') {
			var iBlockedUsers = _.toArray(iBlocked);
			console.log('Run Blocked I', iBlockedUsers, this.globals.neighboursData);

			_.map(iBlockedUsers, (user) => {
				console.log('Blocked By Me Users => ', user.id);
				_.remove(this.users, { 'uId': user.id });
			});	
		}
	}

}
