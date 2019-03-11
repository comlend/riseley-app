import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, App, Events, Platform, PopoverController } from 'ionic-angular';
import { AddNewsPage } from '../add-news/add-news';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { NewsDetailsPage } from '../news-details/news-details';
import { MessagePage } from '../message/message';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { FCM } from '@ionic-native/fcm';
import { ReportPostPage } from '../report-post/report-post';

@Component({
	selector: 'page-news',
	templateUrl: 'news.html',
})
export class NewsPage {
	chats: any[];
	news: any;
	searchQuery: string = '';
	userId: any;
	liked: boolean = false;
	commentsLength: any;
	commentsArr = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public firebase: FirebaseProvider, public global: GlobalsProvider, public events: Events, public zone: NgZone, public splashScreen: SplashScreen, public storage: Storage, public utilities: UtilitiesProvider, private fcm: FCM, private platform: Platform, public popoverCtrl: PopoverController) {
		// this.initializeGobalsData();
		this.news = this.global.news;

		this.initializeData();

		this.events.subscribe('newsupdated', () => {
			this.zone.run(() => {
				this.news = this.global.news;
				console.log(this.news);
				this.handleAlreadyLikedPosts();	
				this.updatedProfilePicture();			
			});
		});

		// FOR UNREAD MESSAGES TAB BADGE UPDATE
		this.unreadMessagesMet();	
		
		//for subscribing to news related updates
		if (this.platform.is('ios') || this.platform.is('android')) {
			this.fcm.subscribeToTopic("news").then(() => {
				// console.log('subscribed to news');
				this.storage.set('subscribedToNews', true);
			}).catch((error) => {
				console.log('topic subscription error', error);
			});
		}
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewsPage');
		// console.log('handleAlreadyLikedPosts Ended => ', moment().format('X'));

		// Hiding Splashscreen here because page variables taking long time
		this.splashScreen.hide();
		this.getAllLocals();


		this.firebase.getUpdatedBlockedByMeList();
		this.firebase.getUpdatedBlockedMeList();
		
	}

	initializeData() {
		this.userId = this.global.userId;
		this.news = this.global.news;
		// this.updatedProfilePicture();

		// this.handleAlreadyLikedPosts();

	}
	presentPopover(myEvent,news) {
		console.log(news)
		let popover = this.popoverCtrl.create(ReportPostPage, {news: news});
		popover.present({
			ev: myEvent
		});
	}
	addNews() {
		this.app.getRootNav().push(AddNewsPage);
	}

	newsDetails(newsData) {
		this.app.getRootNav().push(NewsDetailsPage, { 'news': newsData });
	}

	goToMessage(newsData) {
		this.app.getRootNav().push(MessagePage, { 'neighbour': newsData });
	}

	addLike(newsData) {		
		newsData.postLiked = true;
	
		var userId = this.global.userId;
		var previousLikesArr = _.toArray(newsData.likes);
		var userAlreadyLiked = _.find(previousLikesArr, { 'uId': userId });
		if (userAlreadyLiked) {			
			// console.log('Post Already Liked');
		} else {
			// newsData.postLiked = false;
			// console.log('User Id ', this.global.userId, previousLikesArr, newsData);
			this.firebase.addLikeToNews(this.global.userData, newsData).then((data) => {
				// console.log('like added');
				newsData.postLiked = true;
			});
		}

		// console.log('News ', newsData, this.news);
	}

	removeLike(news) {
		// console.log('Remove Like ', news);
		news.postLiked = false;
		var userId = this.global.userId;
		var like = _.find(news.likes, { 'uId': userId });
		// console.log('Remove Like ', like.id);
		this.firebase.removeLikesFromNews(news, like).then();
	}

	handleAlreadyLikedPosts() {
		var userId = this.global.userId;
		
		for (let i = 0; i < this.news.length; i++) {
			var eachNews = this.news[i];
			var previousLikesArr = _.toArray(eachNews.likes);

			var userAlreadyLiked = _.find(previousLikesArr, { 'uId': userId });
			if (userAlreadyLiked) {
				eachNews.postLiked = true;
				// console.log('Post Already Liked');
			} else {
				eachNews.postLiked = false;
			}			
		}
		
		console.log('Likes Handled ', this.news);
	}
	updatedProfilePicture(){
		var news = this.news;
		var user = this.global.userData;
		var neighbours = this.global.neighboursData;
		// console.log('handleAlreadyLikedPosts Started => ', moment().format('X'));

		for (let i = 0; i < news.length; i++) {
			var eachNews = news[i];

			switch (true) {
				case (user.uId == eachNews.uId):
					eachNews.profileurl = user.profileurl;
					break;

				case (true):
					for (let j = 0; j < neighbours.length; j++) {
						var neighbour = neighbours[j];
						if (neighbour.uId == eachNews.uId) {
							eachNews.profileurl = neighbour.profileurl;
						}						
					}
					break;
			
				default:
					break;
			}
			
		}
	}


	unreadMessagesMet() {
		var userId = this.global.userId;
		this.chats = this.global.chats;
		// alert(JSON.stringify(this.chats));
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
		this.firebase.setUnreadMessageCount(totalUnreadMessages, this.global.userId);
		if (totalUnreadMessages > 0) {
			this.global.unreadMessages = totalUnreadMessages;
			this.storage.set('unreadMessages', totalUnreadMessages);
			// this.firebase.setUnreadMessageCount(totalUnreadMessages, this.global.userId);
			// alert(this.global.unreadMessages);
			this.events.publish('unread:messages');
		}
	}


	//load globals data before app initialization


	initializeGobalsData(){
		var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats(), this.getAllNews()];
		Promise.all(promises).then((values) => {
			// this.extractNeighbourData();
			// this.getAllNews();
			// this.getAllLocals();

			// console.log('all data loaded', values);
			this.extractNeighbourData();
			// this.firebase.getUpdatedBlockedByMeList();
			// this.firebase.getUpdatedBlockedMeList();
			// if (this.global.userData.unreadMessages) {
			// 	this.storage.set('unreadMessages', this.global.userData.unreadMessages);
			// }

			

		}).catch((err) => {
			console.log('Promise.all ', err);
		});
	}
	getUserData() {
		var userId = this.global.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/' + userId);
			var userArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					userArr = data.val();
					this.global.userData = userArr;
					// console.warn(' Component User Data ', this.global.userData);
					resolve(userArr);
				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}
	getNeighbours() {
		var userId = this.global.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/');
			var neighboursArr = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					neighboursArr = _.toArray(data.val());
					_.remove(neighboursArr, { 'uId': userId });

					// console.log('neighboursArray ', neighboursArr);
					this.global.neighboursData = neighboursArr;
					this.events.publish('neighboursUpdated');

					// this.utilities.filterBlockedMeUsers(this.global.userData.blockedMe);
					// this.utilities.filterBlockedByMeUsers(this.global.userData.blockedByMe);

					resolve();

				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}

	getAllChats() {
		return new Promise((resolve, reject) => {
			var userId = this.global.userId;
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

				this.global.chats = chatArr;
				// this.event.publish('new-message');
				resolve();
				// console.log('Chat Arr ', chatArr);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getAllLocals() {
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/locals/');
			var localsArr = [];
			dbRef.on('value', (data) => {
				if (data.val() != 'default') {
					localsArr = _.toArray(data.val()).reverse();
					this.global.locals = localsArr;
					// console.log('all localss in globals', this.global.locals);
					this.events.publish('localsupdated');

					resolve();

				} else {
					reject();
				}
			});
		});
	}

	getAllNews() {
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/news/');
			var newsArr = [];
			var comments = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					newsArr = _.toArray(data.val()).reverse();
					this.global.news = newsArr;
					// console.log('all news in globals', this.global.news);
					this.events.publish('newsupdated');
					for (let index = 0; index < newsArr.length; index++) {
						var news = newsArr[index];
						var custNewsData = {};

						if (news.hasOwnProperty('comments')) {
							var commentKeys = Object.keys(news.comments);
							var commentsNumber = Object.keys(news.comments).length;
							var lastCommentKey = commentKeys[commentsNumber - 1];

							var lastComment = news.comments[lastCommentKey];
							// console.log('Last Comment ', lastComment)
							custNewsData['commentsNumber'] = commentsNumber;
							custNewsData['lastComment'] = lastComment;
							news.custNewsData = custNewsData;
						}

						if (news.hasOwnProperty('likes')) {
							var likesNumber = Object.keys(news.likes).length;
							custNewsData['likes'] = _.toArray(news.likes);
							custNewsData['likesNumber'] = likesNumber;
							news.custNewsData = custNewsData;
						}
						// console.log('News Modified Data Form ', news);
						// if (newsArr[index].id == newsArr[index].comments.newsId) {
						// comments.push(_.toArray(newsArr[index].comments.length));
						// }
					}
					// console.log('all comments',comments);
					resolve();

				} else {
					reject();
				}
			});
		});
	}

	extractNeighbourData() {
		// console.log(this.global.neighboursData, this.global.chats);

		return new Promise((resolve, reject) => {
			if (this.global.chats) {
				for (let i = 0; i < this.global.chats.length; i++) {
					let chat = this.global.chats[i];
					let receiver = chat.receiver;

					for (let j = 0; j < this.global.neighboursData.length; j++) {
						let eachNeighbour = this.global.neighboursData[j];
						let neighbourId = eachNeighbour.uId;
						if (receiver == neighbourId) {
							chat.receiverData = eachNeighbour;

							break;
						}
					}
				}
				resolve();
			}
		});

		// console.log('All Chats Modified ', this.global.chats);

	}

}
