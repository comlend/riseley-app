import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events, ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

import { FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { FirstPage } from '../first/first';


@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	public loginForm;
	returnInvalid: boolean = false;
	user: { email?: any, password?: any } = {};
	loading: any;
	showPassError: boolean= true;

	constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: FirebaseProvider, public globals: GlobalsProvider, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public event: Events, public utilities: UtilitiesProvider, private toastCtrl: ToastController) {
		this.initializeForm()
	}

	initializeForm() {
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}
	back() {
		this.navCtrl.pop();
	}
	checkPassLength() {
		if (this.user.password.length < 6) {
			this.showPassError = true;
		}
		else
			this.showPassError = false;
	}


	loginUser(): void {
		// console.log(this.user);
		// this.returnInvalid = true;
		if (!this.loginForm.valid) {
			// console.log(this.loginForm.value);
		} else {
			this.firebase.loginData(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
				// console.log('AuthData ', authData);
				this.loading.dismiss().then(() => {
					this.globals.userId = authData.uid;

					// console.log('new user ->', this.globals.userId);
					var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
					Promise.all(promises).then((values) => {
						this.extractNeighbourData();
						this.getAllNews();
						this.getAllLocals();
						// this.getUserData();
						//    
						console.log('Promise.all resolved');
						if (this.globals.FbLoginComplete) {
							// this.loading.dismiss();
							this.navCtrl.setRoot(FirstPage);
						}
						else if (!this.globals.FbLoginComplete) {

							return;
						}

					}).catch((err) => {
						console.log('Promise.all ', err);
					});
				});
			}, error => {
				this.loading.dismiss().then(() => {
					this.returnInvalid = true;
				});
			});

			this.loading = this.loadingCtrl.create({ content: 'Logging you in...' });
			this.loading.present();
		}
	}

	clearErrors() {
		if (this.user.email == "" || this.user.password == "") {
			this.returnInvalid = false;
		}
	}

	resetPass() {
		// console.log("pass reset", this.loginForm.value.email)
		var auth = firebase.auth();
		var emailAddress = this.loginForm.value.email;
		if (emailAddress == '') {
			let toast = this.toastCtrl.create({
				message: 'Please input your email and then press Reset Password link',
				duration: 5000,
				position: 'bottom'
			});
			toast.present();
		}
		else {
		
			auth.sendPasswordResetEmail(this.loginForm.value.email).then(() => {
				// this.presentLoadingDefault();
				let toast = this.toastCtrl.create({
					message: 'Please check your email for password reset instructions',
					duration: 5000,
					position: 'bottom'
				});
				toast.present();
				// Email sent.
			}).catch(function (error) {
				// An error happened.
				console.log(error);
				let toast = this.toastCtrl.create({
					message: 'Some error occured. Please try again',
					duration: 5000,
					position: 'bottom'
				});
				toast.present();
			});

		}
	}

	presentLoadingDefault() {
		let loading = this.loadingCtrl.create({
			content: 'Please check your email for password reset instructions'
		});

		loading.present();

		setTimeout(() => {
			loading.dismiss();
		}, 3000);
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
					console.warn(' Component User Data ', this.globals.userData);
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

					this.utilities.filterBlockedMeUsers(this.globals.userData.blockedMe);
					this.utilities.filterBlockedByMeUsers(this.globals.userData.blockedByMe);

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
	getAllLocals() {
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/locals/');
			var localsArr = [];
			dbRef.on('value', (data) => {
				if (data.val() != 'default') {
					localsArr = _.toArray(data.val()).reverse();
					this.globals.locals = localsArr;
					console.log('all localss in globalss', this.globals.locals);
					this.event.publish('localsupdated');

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
					this.globals.news = newsArr;
					console.log('all news in globalss', this.globals.news);
					this.event.publish('newsupdated');
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

			// console.log('All Chats Modified ', this.globals.chats);
		}
	}
}
