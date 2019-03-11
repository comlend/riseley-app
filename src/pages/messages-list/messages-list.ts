import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, App } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';

import { MessagePage } from "../message/message";

import * as firebase from 'firebase';
import * as _ from 'lodash';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Storage } from '@ionic/storage';


@Component({
	selector: 'page-messages-list',
	templateUrl: 'messages-list.html',
})
export class MessagesListPage {
	chats = [];
	lastMsg: any;

	searchQuery: string = '';

	editable: boolean = false;
	chatsToDelete: any = [];
	constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public _zone: NgZone, public events: Events, public app: App, public firebaseProvider: FirebaseProvider, public storage: Storage) {
		// this.chats = this.globals.chats;		
		
	}

	ionViewWillEnter() {	
		
		this.getAllChats().then(() => {				
	
		});
		// console.log('Chats Available Message ', this.chats);
		// console.log('last message', this.lastMsg);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagesListPage');
	}

	showLastMessage() {
		for (let i = 0; i < this.chats.length; i++) {
			var chat = this.chats[i];
			var messages = chat.messages;
			// console.log('Chat ', chat, ' Messages ', messages);
			for (let j = messages.length-1; j >= 0; j--) {
				var message = messages[j];
				// console.log(this.globals.userId, message.sentby);
				/* if (this.globals.userId != message.sentby) { */
					if (message.message.indexOf('http') > -1) {
						// console.log('Last Message ', message);
						chat.lastMsg = 'Image Added';
						chat.lastMsgTime = message.timestamp;
					} else {
						chat.lastMsg = message.message;
						chat.lastMsgTime = message.timestamp;
						// this.lastMsg = chat.lastMsg;
					}

				// console.log(chat.lastMsg);
				break;					
				/* } */				
			}			
		}
	}

	getAllChats() {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			// console.log('User ID ', userId);
			var dbRef = firebase.database().ref('chats').child(userId);
			dbRef.on('value', (chats) => {
				var chatArr = [];
				
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
				console.log('Chat Arr ', chatArr);
				
				this.extractNeighbourData();


				this.chats = this.globals.chats;
				this.showLastMessage();

				this.unreadMessages();
				resolve();
			});
		});
	}

	extractNeighbourData() {
		// console.log('RUN EXTRACTED');
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

	goToChatPage(chat) {
		this.app.getRootNav().push(MessagePage, { 'neighbour': chat.receiverData, 'unreadCompensation': chat.unreadMessages });
	}

	unreadMessages() {
		var userId = this.globals.userId;
		var totalUnreadMessages = 0;
		for (let i = 0; i < this.chats.length; i++) {
			var chat = this.chats[i];
			chat.unreadMessages = 0;
			var messages = chat.messages;
			// console.log('Chat ', chat, ' Messages ', messages);
			for (let j = messages.length - 1; j >= 0; j--) {
				var message = messages[j];
				// console.log(j + ' ' + message.message + ' ' + message.status);

				if (userId != message.sentby && message.status == 'Delivered') {
					chat.unreadMessages++;
				}
			}
			// console.log('Each Chat Unread Message ', chat.unreadMessages);
			totalUnreadMessages += chat.unreadMessages;
		}
		// console.log('Total Unread Messages ', totalUnreadMessages);
		// this.firebaseProvider.setUnreadMessageCount(totalUnreadMessages, this.globals.userId);
		if (totalUnreadMessages > 0) {
			this.globals.unreadMessages = totalUnreadMessages;
			// this.firebaseProvider.setUnreadMessageCount(totalUnreadMessages, this.globals.userId);
			// this.storage.set('unreadMessages', totalUnreadMessages);
			this.events.publish('unread:messages');
		} else {
			this.globals.unreadMessages = 0;
		}

		console.log('Total Uread in LIst=> ', this.globals.unreadMessages);
	}

	onSearchInput(event) {
		var query = this.searchQuery/* event.data */;
		var chats = this.chats;

		var chatsMatched = [];
		// console.log('Query ', query);
		if (query == '') {
			this._zone.run(() => {
				chatsMatched = this.globals.chats;
			});			
			// console.log(' Globals ', this.globals.chats);
		} else {
			for (let i = 0; i < chats.length; i++) {
				var chat = chats[i];
				var name = chat.receiverData.firstName + ' ' + chat.receiverData.lastName;

				if (name.indexOf(query) > -1) {
					chatsMatched.push(chat);
				}
			}
		}
		

		this.chats = chatsMatched;
		// console.log('Matched Neighbours ', chatsMatched, ' Globals ', this.globals.chats);
		// console.log('Search Input ', event, this.chats);
	}

	onSearchCancel(event) {
		this._zone.run(() => {
			this.chats = this.globals.chats;
		});			
		console.log(' Globals ', this.globals.chats);
		
		console.log('Search Cancel', event);
	}

	goToMyNeighbours() {
		var tabIndex = 1;
		this.app.getRootNav().getActiveChildNav().select(tabIndex);
	}

	doEditable() {
		this.editable = true;
	}

	undoEditable() {
		this.editable = false;		
	}

	addChatsToDelete(chat) {
		if (this.chatsToDelete.length == 0) {
			this.chatsToDelete.push(chat);
		} else {
			var chatFound = _.find(this.chatsToDelete, { 'receiver': chat.receiver });
			if (chatFound) {
				_.remove(this.chatsToDelete, { 'receiver': chat.receiver })
			} else {
				this.chatsToDelete.push(chat);
			}
		}		
		// console.log('Chats To Delete ', this.chatsToDelete);
	}

	deleteSelecTedChats() {
		this.undoEditable();
		
		var chats = this.chatsToDelete;

		this.firebaseProvider.deleteChats(chats).then((data: any) => {
			if (data.success) {
				this.chatsToDelete = [];
				this.getAllChats().then(() => {
					this.chats = this.globals.chats;
				});				
			}
		}).catch((err) => {
			console.log('Delete Chats Error: ', err);
		});
	}
}