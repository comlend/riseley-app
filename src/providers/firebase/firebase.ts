import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { GlobalsProvider } from '../globals/globals';
import * as _ from 'lodash';
import * as moment from 'moment';
import { UtilitiesProvider } from '../utilities/utilities';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';
import { RequestOptions } from '@angular/http';
// import { resolve } from 'dns';

@Injectable()
export class FirebaseProvider {
	firebaseUsers: any;
	confirmationResult: any = undefined;

	firemessagecounter = firebase.database().ref('/chats');
	neighbour: any;
	neighbourmessages = [];
	msgcount = 0;

	constructor(private http: HttpClient, public globals: GlobalsProvider, public events: Events, public event: Events, public utilities: UtilitiesProvider, public fcm: FCM, public storage: Storage, public badge: Badge) {
		console.log('Hello FirebaseProvider Provider');
	}

	signupBizUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, profileurl: any, name: string, userType: string, details: string, imageData: any, phone: any) {
		// console.log('Image Data => ', imageData);

		return new Promise((resolve, reject) => {
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
				email: email,
				firstName: firstName,
				lastName: lastName,
				createdAt: createdAt,
				userType: userType,
				name: name,
				details: details,
				deviceToken: deviceToken,
				phone: phone,
				hideProfile: false,
				blockedByMe: 'default',
				blockedMe: 'default',
				pushSound: 'default',
				showMessageNotification: true,
				showMessagePreview: true,
				subscribedNews: true,
				profileurl: 'assets/imgs/imgPlaceholder.png'
			};

			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				console.log("new user", newUser.uid);
				userData['uId'] = newUser.uid;
				this.globals.userData = userData;

				firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {

					var userRef = firebase.database().ref('/users').child(newUser.uid);
					if (imageData == 'assets/imgs/imgPlaceholder.png') {
						this.globals.userData.profileurl = 'assets/imgs/imgPlaceholder.png';
						// userRef.update({
						// 	profileurl: imageData
						// });
						resolve(newUser);
					} else {
						this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
							this.globals.userData.profileurl = imageUrl;
							userRef.update({
								profileurl: imageUrl
							});
							resolve(newUser);
						});
					}
					var admin: any = _.find(this.globals.neighboursData, { 'userType': 'admin' });
					var message = "New User Signed Up<br>Name: " + this.globals.userData.firstName + ' ' + this.globals.userData.lastName + '<br>Apartment No: ' + this.globals.userData.unit + '<br>Mobile: <a href=\"tel:' + this.globals.userData.phone + '\">';
					console.log(message);
					this.emailServiceReq(message, admin);

				}).catch((error) => {
					console.log('error at the time of image update', error);
					// reject(error);
				});
				// }););
				/* if (imageData == 'assets/imgs/imgPlaceholder.png') {
					console.log('if => ', imageData);
					userData['profileurl'] = imageData;
					firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
						resolve(newUser);
					});
				} else {
					this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
						console.log("else data output", email, firstName, lastName, createdAt, imageUrl);
						userData['profileurl'] = imageUrl;
						
						firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
							
							this.fcm.subscribeToTopic("news").then(() => {
								console.log('subscribed to news');
								this.storage.set('subscribedToNews', true);
								firebase.database().ref('/users/').child(newUser.uid).update({
									subscribedNews: true
								});
							}).catch((error) => {
								console.log('topic subscription error', error);
							});

							resolve(newUser);
						});
					});
				} */
			}).catch((error) => {
				console.log('error at signup', error);
				reject(error);
				// });
			});

		});
	}
	signupUser(email: string, password: string, firstName: string, lastName: string, createdAt: string, userType: string, unit: string, imageData: any, phone: any) {
		// console.log('device token Data => ', this.globals.pwaDeviceToken);
		return new Promise((resolve, reject) => {
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
				email: email,
				firstName: firstName,
				lastName: lastName,
				createdAt: createdAt,
				userType: userType,
				deviceToken: deviceToken,
				phone: phone,
				unit: unit,
				hideProfile: false,
				blockedByMe: 'default',
				blockedMe: 'default',
				pushSound: 'default',
				showMessageNotification: true,
				showMessagePreview: true,
				subscribedNews: true,
				profileurl: 'assets/imgs/imgPlaceholder.png'
			};

			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				console.log("new user", newUser.uid);
				userData['uId'] = newUser.uid;
				this.globals.userData = userData;

				firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
					var userRef = firebase.database().ref('/users').child(newUser.uid);
					if (imageData == 'assets/imgs/imgPlaceholder.png') {
						this.globals.userData.profileurl = 'assets/imgs/imgPlaceholder.png';
						// userRef.update({
						// 	profileurl: imageData
						// });
						resolve(newUser);
					} else {
						this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
							this.globals.userData.profileurl = imageUrl;
							userRef.update({
								profileurl: imageUrl
							});
							resolve(newUser);
						});
					}

				}).catch((error) => {
					console.log('error at the time of image update', error);
					// reject(error);
				});
				/* if (imageData == 'assets/imgs/imgPlaceholder.png') {
					// console.log('if => ', imageData);
					userData['profileurl'] = imageData;
					firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {

						// this.fcm.("news").then(() => {
						// 	console.log('subscribed to news');
						// 	this.storage.set('subscribedToNews', true);
						// 	firebase.database().ref('/users/').child(newUser.uid).update({
						// 		subscribedNews: true
						// 	});
						// }).catch((error) => {
						// 	console.log('topic subscription error', error);
						// });
						
						resolve(newUser);
					});
				} else {
					firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
						this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
							// console.log("else data output", email, firstName, lastName, createdAt, imageUrl);
							userData['profileurl'] = imageUrl;
							resolve(newUser);
						});						
					});
				} */
			}).catch((error) => {
				console.log('singup error', error);
				reject(error);
				// });
			});

		});
	}
	signupManager(email: string, password: string, firstName: string, lastName: string, createdAt: string, userType: string, imageData: any, phone: any, role: any) {
		return new Promise((resolve, reject) => {
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
				email: email,
				firstName: firstName,
				lastName: lastName,
				createdAt: createdAt,
				userType: userType,
				deviceToken: deviceToken,
				phone: phone,
				hideProfile: false,
				blockedByMe: 'default',
				blockedMe: 'default',
				pushSound: 'default',
				showMessageNotification: true,
				showMessagePreview: true,
				subscribedNews: true,
				profileurl: 'assets/imgs/imgPlaceholder.png',
				role: role
			};
			firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
				// console.log("new user", newUser.uid);
				userData['uId'] = newUser.uid;
				// userData['profileurl'] = imageData;
				this.globals.userData = userData;

				firebase.database().ref('/users').child(newUser.uid).set(userData).then(() => {
					var userRef = firebase.database().ref('/users').child(newUser.uid);
					if (imageData == 'assets/imgs/imgPlaceholder.png') {
						this.globals.userData.profileurl = 'assets/imgs/imgPlaceholder.png';
						// userRef.update({
						// 	profileurl: imageData
						// });
						resolve(newUser);
					} else {
						this.uploadProfile(imageData, newUser.uid).then((imageUrl) => {
							this.globals.userData.profileurl = imageUrl;
							userRef.update({
								profileurl: imageUrl
							});
							resolve(newUser);
						});
					}

				}).catch((error) => {
					console.log('error at the time of image update', error);
					// reject(error);
				});
			}).catch((error) => {
				console.log('Error getting location', error);
				reject(error);
			});
		});
	}
	unsubscribeFromTopic() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			this.fcm.unsubscribeFromTopic("news").then(() => {

				firebase.database().ref('/users/').child(userId).update({
					subscribedNews: false
				});
				console.log('subscribed to news');
			}).catch((error) => {
				console.log('topic subscription error', error);
			});

			resolve();
		});


	}
	subscribeToTopic() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			this.fcm.subscribeToTopic("news").then(() => {
				console.log('subscribed to news');
				firebase.database().ref('/users/').child(userId).update({
					subscribedNews: true
				});
			}).catch((error) => {
				console.log('topic subscription error', error);
			});

			resolve();
		});
	}
	updateUserPic(data, userId) {
		var filename = userId + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/profile/' + filename).put(data);
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);
				firebase.database().ref('/users').child(userId).update({
					profileurl: uploadTask.snapshot.downloadURL,
				});

				resolve(uploadTask.snapshot.downloadURL);
				// return;
			});
		});
	}
	updateUserData(firstName, lastName, phone, unit, userId) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/users/').child(userId).update({
				firstName: firstName,
				lastName: lastName,
				phone: phone,
				unit: unit
			});

			resolve();
		});

	}
	updateBusinessUserData(firstName, lastName, phone, name, details, userId) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/users/').child(userId).update({
				firstName: firstName,
				lastName: lastName,
				phone: phone,
				name: name,
				details: details
			});

			resolve();
		});
	}


	loginData(email: string, password: string) {
		this.globals.reinitializeGlobals();
		return firebase.auth().signInWithEmailAndPassword(email, password);
	}

	logOut() {
		return new Promise((resolve, reject) => {
			firebase.auth().signOut().then((authdata) => {
				resolve();
				this.storage.clear();
				this.globals.clear();
				this.badge.clear();
				this.globals.reinitializeGlobals();
			});
		})


	}

	public uploadProfile(data, userId) {
		var filename = userId + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/profile/' + filename).put(data);
		// (data, 'base64', { contentType: 'image/jpeg' });
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);

				resolve(uploadTask.snapshot.downloadURL);
				return;
			});
		});
	}
	public uploadMessagePic(data) {
		var filename = (new Date()).getTime() + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/messages/' + filename).put(data);
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);

				resolve(uploadTask.snapshot.downloadURL);
				return;
			});
		});
	}
	public uploadPicture(data) {
		var filename = (new Date()).getTime() + '.jpg';
		let uploadTask = firebase.storage().ref('/photos/news-pictures/' + filename).put(data);
		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed', (snapshot) => {

			}, (err) => {
				reject(false);
			}, () => {
				console.log(uploadTask.snapshot.downloadURL);

				resolve(uploadTask.snapshot.downloadURL);
				return;
			});
		});
	}


	getNeighbours() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users/');
			var userArr = [];
			dbRef.once('value', (data) => {

				if (data.val() != 'default') {
					userArr = _.toArray(data.val());
					this.removeSelfFromNeighbours(userArr);
					console.log('All Neighbours ', userArr);
					if (userArr.length > 0) {
						// console.log('users Array ', userArr);
						resolve(userArr);
					} else {
						reject({ msg: 'No users Found' });
					}
				} else {
					reject({ msg: 'No Users Found' });
				}
			});
		});
	}

	removeSelfFromNeighbours(neighboursArr) {
		var userId = this.globals.userId;

		_.remove(neighboursArr, { 'uId': userId });
		return neighboursArr;
	}

	formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}
	formatDate(date) {
		var dd = date.getDate();
		var mm = date.getMonth() + 1;
		var yyyy = date.getFullYear();
		if (dd < 10)
			dd = '0' + dd;
		if (mm < 10)
			mm = '0' + mm;
		return dd + '/' + mm + '/' + yyyy;
	}

	addnewmessage(msg, neighbourId, type) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());

		// Default Status is Delivered for every message
		let msgStatus = 'Delivered';

		// console.log('type - ',type, ' chat message>>>', msg, ' neighbour >>>', neighbourId);

		var userId = this.globals.userId;
		// console.log(userId);
		var firechats = firebase.database().ref('/chats/');

		if (neighbourId) {
			var promise = new Promise((resolve, reject) => {
				var msgObj = {
					sentby: userId,
					sentTo: neighbourId,
					status: msgStatus,
					message: msg,
					timestamp: firebase.database.ServerValue.TIMESTAMP,
					timeofmsg: time,
					dateofmsg: date,
					type: type,
					id: ''
				};

				var saveMsgSender = firechats.child(userId).child(neighbourId).push();


				var uniqueMsgKey = saveMsgSender.key;
				var userBlocked: boolean = false;
				// Add Unique Key
				msgObj.id = uniqueMsgKey;
				// console.log('I blocked Neighbour id',_.find(this.globals.blockedByMe, { 'uId': neighbourId }));
				// console.log('Neighbour blocked me id', _.find(this.globals.blockedMe, { 'uId': neighbourId }));

				// console.warn(this.globals.blockedByMe);
				if (_.find(this.globals.blockedMe, { 'uId': neighbourId }) || _.find(this.globals.blockedByMe, { 'uId': neighbourId })) {
					userBlocked = true;
				} else {
					userBlocked = false;
				}

				// console.log('Message To be Sent ', uniqueMsgKey, msgObj);
				saveMsgSender.set(msgObj).then(() => {

					var saveMsgReceiver = firechats.child(neighbourId).child(userId).child(uniqueMsgKey);

					if (!userBlocked) {
						console.log('this user is blocked?', userBlocked);
						saveMsgReceiver.set(msgObj).then(() => {
							resolve(true);
						}).catch((err) => {
							reject(false);
						});
					}

				});
			});
			return promise;
		}
	}

	getnewMsg(neighbourId) {
		return new Promise((resolve) => {
			var userId = this.globals.userId;
			var firechats = firebase.database().ref('/chats/' + userId);
			let temp;

			firechats.child(neighbourId).limitToLast(1).on('child_added', (resp) => {
				temp = resp.val();

				// Convert Message Obj to Array
				this.neighbourmessages.push(temp);
				console.log('counter Message Arr', this.neighbourmessages)

				resolve(this.neighbourmessages);
				this.events.publish('newmessage');

			});
		});
	}

	getneighbourmessages(neighbourId) {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			var firechats = firebase.database().ref('/chats/' + userId);
			let temp;
			this.neighbourmessages = [];


			firechats.child(neighbourId).on('value', resp => {
				temp = resp.val();

				// console.log('counter Message ', temp)

				// Convert Message Obj to Array
				this.neighbourmessages = _.toArray(temp);
				// console.log('counter Message Arr', this.neighbourmessages)

				resolve(this.neighbourmessages);
				/* for (var tempkey in temp) {
					this.neighbourmessages.push(temp[tempkey]);
				} */
				// this.events.publish('newmessage');


				// console.log(this.neighbourmessages);


			});
		});
	}

	updateChatMsgStatus(userId, neighbourId, chat) {
		var updateSenderRef = firebase.database().ref('/chats').child(userId).child(neighbourId).child(chat.id);
		updateSenderRef.update({
			status: 'Read'
		}).then(() => {
			return ({ success: true, msg: 'Chat Message Status Updated' });

			/* var updateReceiverRef = firebase.database().ref('/chats').child(neighbourId).child(userId).child(chat.id);
			updateReceiverRef.update({
				status: 'Read'
			}).then(() => {
				// Update msg status event
				return({success: true, msg: 'Chat Message Status Updated'});
			}); */
		});
	}

	chatMsgStatusUpdate(userId, neighbourId/* , chat */) {
		var updatedSenderRef = firebase.database().ref('/chats').child(userId).child(neighbourId)/* .child(chat.id) */;
		updatedSenderRef.on('child_changed', (data: any) => {
			var updatedData = data.val();
			// console.log('Updated Data ', updatedData);				

			// console.log(userId + ' == ' + updatedData.sentby + ' && ' + updatedData.status + ' == Read');
			if (userId == updatedData.sentby && updatedData.status == 'Read') {
				this.events.publish('chatstatus:updated');
				// console.log('Updated Data ', updatedData);				
			}
			// alert('Hey Neighbour read your message');
		});
	}

	sendChatMsgNoti(neighbourDeviceToken, msg, neighbourData) {
		return new Promise((resolve, reject) => {
			var url = 'https://fcm.googleapis.com/fcm/send';

			var notificationPayload = {
				title: 'Your neighbour ' + this.globals.userData.firstName + ' sent you a message',
				sound: neighbourData.pushSound,
				// badge: badgeCount,
				click_action: "FCM_PLUGIN_ACTIVITY",
				icon: "fcm_push_icon",
				body: msg
			};
			if (neighbourData.showMessagePreview) {
				notificationPayload['body'] = msg;
			}

			var options = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					'Authorization': 'key=AAAAO_6rkac:APA91bEyJcns09BjtWfrr5f0iXu2WBlQN2kr_B7ksr6-g1hY28EA5dC9zxcQjPdRmLJfybVgxFYvSvQpkXrjfrCGsixM2A9eC_N5iH_cyQHcoKT9hMRXssTu9s7RaJhqt--aLF-RvDoZnaXDDbYO7acUWiW3dRv7IA'
				})
			};

			// let options = new HttpHeaders().set('Content-Type', 'application/json'); options.set('Authorization', 'key=AAAAiMHir-c:APA91bFvVxldmUVwhcHfv50Bidgj4d9Q1QtqmZ9umsn6Ntzs7qxpnic0Kp0QpMM5QVUtksBRXS0ybO-DTggVJDNc6IKimv2ofHC9Mr4CML1FU6eB2jphloU28FCtmMh8B_uONknaI9k8')
			var badgeCount = this.globals.unreadMessages + 1;
			console.log("unread messages", badgeCount);


			var body = {
				to: neighbourDeviceToken,
				priority: "high",
				notification: notificationPayload
			};

			console.log('Headers Before Push Post ', options);
			console.log('Body Before Push ', JSON.stringify(body));
			this.http.post(url, JSON.stringify(body), options).subscribe((res) => {
				console.log('Noti Send Firbase Respone ')
				console.log(res);
			})
		});
	}

	sendNewsCommentNoti(newsPublisherDeviceToken) {
		var userData = this.globals.userData;
		var publisherDeviceToken = newsPublisherDeviceToken.deviceToken;
		var publisherId = newsPublisherDeviceToken.uId;
		var sendNoti: boolean;

		for (let index = 0; index < this.globals.neighboursData.length; index++) {
			if (publisherId == this.globals.neighboursData[index].uId) {
				sendNoti = this.globals.neighboursData[index].subscribedNews;
			}

		}

		return new Promise((resolve, reject) => {
			var url = 'https://fcm.googleapis.com/fcm/send';

			var options = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					'Authorization': 'key=AAAAO_6rkac:APA91bEyJcns09BjtWfrr5f0iXu2WBlQN2kr_B7ksr6-g1hY28EA5dC9zxcQjPdRmLJfybVgxFYvSvQpkXrjfrCGsixM2A9eC_N5iH_cyQHcoKT9hMRXssTu9s7RaJhqt--aLF-RvDoZnaXDDbYO7acUWiW3dRv7IA'
				})
			};

			var notificationPayload = {
				title: userData.firstName + ' commented on your news',
				sound: "default",
				click_action: "FCM_PLUGIN_ACTIVITY",
				icon: "fcm_push_icon"
			};

			var body = {
				to: publisherDeviceToken,
				priority: "high",
				notification: notificationPayload
			};

			/* console.log('Headers Before Push Post ', options);
			console.log('Body Before Push ', JSON.stringify(body)); */
			if (sendNoti) {
				this.http.post(url, JSON.stringify(body), options).subscribe((res) => {
					console.log('Noti Send Firbase Respone ', res);
					resolve(res);
				})
			}

		});
	}

	updateFcmDeviceToken(deviceToken) {
		return new Promise((resolve, reject) => {
			var userId = this.globals.userId;
			var dbRef = firebase.database().ref('/users/' + userId).child('deviceToken');

			dbRef.update({
				deviceToken: deviceToken
			}).then(() => {
				resolve();
			}).catch(() => {
				reject();
			});
		});
	}

	deleteChats(chats) {
		var userId = this.globals.userId;
		var deletePromises = [];
		return new Promise((resolve, reject) => {
			for (let i = 0; i < chats.length; i++) {
				let chat = chats[i];
				var neighbourId = chat.receiver;

				var dbRef = firebase.database().ref('/chats').child(userId).child(neighbourId).remove();

				deletePromises.push(dbRef);
			}

			Promise.all(deletePromises).then(() => {
				resolve({ success: true, msg: 'Chats Deleted Successfully' });
			}).catch((err) => {
				reject(err);
			})
		});

	}
	addLocal(userData, local, localName, localPicUrl) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/locals/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				timeofPost: moment().format(),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				date: date,
				time: time,
				local: local,
				unit: userData.unit,
				userType: userData.userType,
				deviceToken: userData.deviceToken,
				id: dbref.key,
				localName: localName,
				picUrl: localPicUrl
			});
			resolve();
		});
	}
	addNews(userData, news, picture) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/news/').push();
		var owner_newsdetails = {
			uId: userData.uId,
			firstName: userData.firstName,
			lastName: userData.lastName,
			profileurl: userData.profileurl,
			timeofPost: moment().format(),
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			date: date,
			time: time,
			news: news,
			userType: userData.userType,
			deviceToken: userData.deviceToken,
			id: dbref.key,
			newspic: picture
		}
		if (userData.userType != 'business') {
			owner_newsdetails['unit'] = userData.unit;
		} else if (userData.userType == 'business') {
			owner_newsdetails['name'] = userData.name;
		}
		return new Promise((resolve, reject) => {
			dbref.set(
				owner_newsdetails
			);
			this.sendNewsNoti();
			resolve();
		});
	}
	reportNews(news){
		return new Promise((resolve, reject) => {
			var dbref = firebase.database().ref('/reportedNews/').push();
			dbref.set({
				newsId: news.id,
				reportTime: moment().format(),
				reportingUserId: this.globals.userId,
				reportId: dbref.key
			});
			var neighboursArr = this.globals.neighboursData;
			var admin: any = _.find(neighboursArr, { 'userType': 'admin' });
			var message = "News Reported: <br>Name: " + this.globals.userData.firstName + ' ' + this.globals.userData.lastName + '<br>Apartment No: ' + this.globals.userData.unit + '<br>Time: ' + moment().format('LLL') + '<br>News Id: ' + news.id;

			this.emailServiceReq(message, admin);
			resolve();
		});
	}
	deleteNews(newsId) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/news/').child(newsId).remove();
			resolve();
		});
	}
	editNews(userData, newsId, news, picture){
		var dbref = firebase.database().ref('/news/').child(newsId);
		return new Promise((resolve, reject) => {
			dbref.update({
				news: news,
				newspic: picture
			}).then(()=>{
				resolve();
			});
			// this.sendNewsNoti();
			
		});
	}
	sendNewsNoti() {
		var userData = this.globals.userData;

		return new Promise((resolve, reject) => {
			var url = 'https://fcm.googleapis.com/fcm/send';

			var options = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					'Authorization': 'key=AAAAO_6rkac:APA91bEyJcns09BjtWfrr5f0iXu2WBlQN2kr_B7ksr6-g1hY28EA5dC9zxcQjPdRmLJfybVgxFYvSvQpkXrjfrCGsixM2A9eC_N5iH_cyQHcoKT9hMRXssTu9s7RaJhqt--aLF-RvDoZnaXDDbYO7acUWiW3dRv7IA'
				})
			};

			var notificationPayload = {
				title: 'A new post has been added',
				sound: "default",
				click_action: "FCM_PLUGIN_ACTIVITY",
				icon: "fcm_push_icon"
			};

			var body = {
				to: '/topics/news',
				priority: "high",
				notification: notificationPayload
			};

			/* console.log('Headers Before Push Post ', options);
			console.log('Body Before Push ', JSON.stringify(body)); */

			this.http.post(url, JSON.stringify(body), options).subscribe((res) => {
				console.log('Noti Send Firbase Respone ', res);
				resolve(res);
			})
		});
	}

	addCommentToNews(newsData, userData, comment, picture) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/news/' + newsData.id + '/comments/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				date: date,
				time: time,
				comment: comment,
				// unit: userData.unit,
				id: dbref.key,
				newsId: newsData.id,
				commentPic: picture
			});
			resolve();
		});
	}

	addLikeToNews(userData, newsData) {
		// console.log('User Data ', userData, ' News Data ', newsData);
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var dbref = firebase.database().ref('/news/' + newsData.id + '/likes/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				date: date,
				time: time,
				// unit: userData.unit,
				id: dbref.key,
				newsId: newsData.id
			});
			resolve();
		});
	}

	removeLikesFromNews(newsData, like) {
		var newsId = newsData.id;
		var likeId = like.id;

		return new Promise((resolve, reject) => {
			var dbref = firebase.database().ref('/news/' + newsId + '/likes/').child(likeId);

			dbref.remove().then(() => {
				resolve();
			});
		});
	}

	getAllComments(newsId) {
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/news/' + newsId + '/comments/');
			var newsCommentArr = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					newsCommentArr = _.toArray(data.val());
					// this.removeSelfFromNeighbours(newsArr);
					// console.log('All Neighbours ', newsArr);
					if (newsCommentArr.length > 0) {
						// console.log('users Array ', userArr);
						resolve(newsCommentArr);
					} else {
						reject({ msg: 'No comments Found' });
					}
				} else {
					reject({ msg: 'No comments Found' });
				}
			});
		});
	}
	getAllNews() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/news/');
			var newsArr = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					newsArr = _.toArray(data.val());
					// this.removeSelfFromNeighbours(newsArr);
					// console.log('All Neighbours ', newsArr);
					if (newsArr.length > 0) {
						// console.log('users Array ', userArr);
						resolve(newsArr);
					} else {
						reject({ msg: 'No news Found' });
					}
				} else {
					reject({ msg: 'No news Found' });
				}
			});
		});
	}

	hideMyProfile(hideProfile) {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users').child(userId);
			dbRef.update({
				hideProfile: hideProfile
			}).then(() => {
				resolve();
			});
		});
	}

	blockNeighbour(neighbourToBlock) {
		var userId = this.globals.userId;
		var neighbourId = neighbourToBlock.uId;

		return new Promise((resolve, reject) => {
			var userRef = firebase.database().ref('/users').child(userId + '/blockedByMe').child(neighbourId);
			userRef.set({
				id: neighbourId
			});

			var neighbourRef = firebase.database().ref('/users').child(neighbourId + '/blockedMe').child(userId);
			neighbourRef.set({
				id: userId
			});

			Promise.all([userRef, neighbourRef]).then(() => {
				this.getUpdatedBlockedByMeList();

				resolve({ success: true, msg: 'User Blocked' });
			}).catch((err) => {
				reject(err);
			});
		});
	}

	unblockneighbour(neighbourToUnblock) {
		var userId = this.globals.userId;
		var neighbourId = neighbourToUnblock.uId;

		return new Promise((resolve, reject) => {
			var userRef = firebase.database().ref('/users').child(userId + '/blockedByMe').child(neighbourId).remove();

			var neighbourRef = firebase.database().ref('/users').child(neighbourId + '/blockedMe').child(userId).remove();

			Promise.all([userRef, neighbourRef]).then(() => {
				this.getUpdatedBlockedByMeList();
				resolve({ success: true, msg: 'User Unblocked' });
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getUpdatedBlockedByMeList() {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {
			var userRefBlockedByMe = firebase.database().ref('/users').child(userId).child('blockedByMe');

			userRefBlockedByMe.on('value', (updatedList) => {
				if (updatedList.val() != 'default') {
					var updatedListObj = updatedList.val();

					// Update Blocked Neighbours Data
					this.utilities.filterBlockedByMeUsers(_.toArray(updatedListObj));

					resolve();
					// console.log('Updated List Blocked By Me', updatedListObj);
				} else {
					this.globals.blockedByMe = [];
					resolve();
				}
			});
		});
	}

	getUpdatedBlockedMeList() {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {
			var userRefBlockedMe = firebase.database().ref('/users').child(userId).child('blockedMe');

			userRefBlockedMe.on('value', (updatedList) => {
				if (updatedList.val() != 'default') {
					var updatedListObj = updatedList.val();

					// Update Blocked Neighbours Data
					this.utilities.filterBlockedMeUsers(_.toArray(updatedListObj));
					resolve();
					// console.log('Updated List Blocked Me', updatedListObj);
				} else {
					this.globals.blockedMe = [];
					resolve();
				}

			});
		});
	}




	/* old code getBlockedNeighboursIds() {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/users').child(userId).child('blockedByMe');

			dbRef.on('value', (blockedNeighboursIds) => {
				var blockedNeighboursIdsArr = [];

				if (blockedNeighboursIds.val()) {
					blockedNeighboursIdsArr = _.toArray(blockedNeighboursIds.val());
				}

				resolve(blockedNeighboursIdsArr);
			});
		});
	}

	old code getBlockedNeighbours() {
		var userId = this.globals.userId;

		return new Promise((resolve, reject) => {

			this.getBlockedNeighboursIds().then((blockedIds: any) => {
				if (blockedIds.length > 0) {
					var promises = [];

					for (let i = 0; i < blockedIds.length; i++) {
						var blockedId = blockedIds[i].id;

						var dbRef = firebase.database().ref('/users').child(blockedId);

						promises.push(dbRef.once('value'));
					}

					Promise.all(promises).then((values) => {
						var blockedArr = [];

						for (let j = 0; j < values.length; j++) {
							var val = values[j].val();
							blockedArr.push(val);							
						}
						// console.log('OAOAO ', blockedArr)
						resolve(blockedArr);
					}).catch((err) => {
						reject(err);
					});	
				} else {
					resolve({success: false, msg: 'No Blocked Neighbours'});
				}
			});
		});
	} */

	addServiceReqCommon(userData, title, details, picture) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var neighboursArr = this.globals.neighboursData;
		var admin: any = _.find(neighboursArr, { 'userType': 'admin' });
		var dbref = firebase.database().ref('/serviceRequests/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				timeofPost: moment().format(),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				date: date,
				time: time,
				title: title,
				assignedTo: admin.uId,
				assignedToFirstName: admin.firstName,
				assignedToLastName: admin.lastName,
				assignedToprofilePic: admin.profileurl,
				userType: userData.userType,
				unit: userData.unit,
				id: dbref.key,
				supportPic: picture,
				details: details,
				status: 'inProgress'
			});
			var message = "Service Center Request<br>Name: " + userData.firstName + ' ' + userData.lastName + '<br>Apartment No: ' + userData.unit + '<br>Mobile: <a href=\"tel:' + userData.phone + '\">' + userData.phone + '</a><br>Time: ' + moment().format('LLL') + '<br>Title: ' + title;
			console.log(message);
			this.addnewmessage(message, admin.uId, 'text');
			this.emailServiceReq(message, admin);
			// this.sendChatMsgNoti(admin, title, admin)
			resolve();
			// this.event.publish('serviceReqAdded');
		});
	}
	emailServiceReq(message, admin){
		console.log('we are going to send email',admin)
		var url = 'https://us-central1-riseley-st.cloudfunctions.net/sendEmail';
		var body = {
			'message': message,
			'toEmail': admin.email
		};
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};
		console.log(JSON.stringify(body))
		// var headers = new Headers({ 'Content-Type': 'application/json' });
		// headers.append('Access-Control-Allow-Origin', '*');
		// var options = new RequestOptions({ headers: headers });
		// console.log('Url ', url);
		this.http.post(url, JSON.stringify(body), httpOptions).subscribe((data) => {
			console.log(data)
			return
		}, (err) => {
			console.log(err)
			return
		});
	}
	addServiceReqApartment(userData, title, details, picture) {
		let time = this.formatAMPM(new Date());
		let date = this.formatDate(new Date());
		var neighboursArr = this.globals.neighboursData;
		var admin: any = _.find(neighboursArr, { 'userType': 'admin' });
		var dbref = firebase.database().ref('/serviceRequestsApt/').push();
		return new Promise((resolve, reject) => {
			dbref.set({
				uId: userData.uId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				profileurl: userData.profileurl,
				timeofPost: moment().format(),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				date: date,
				time: time,
				title: title,
				assignedTo: admin.uId,
				assignedToFirstName: admin.firstName,
				assignedToLastName: admin.lastName,
				assignedToprofilePic: admin.profileurl,
				userType: userData.userType,
				unit: userData.unit,
				id: dbref.key,
				supportPic: picture,
				details: details,
				status: 'inProgress'
			});
			var message = "Service Center Request<br>Name: " + userData.firstName + ' ' + userData.lastName + '<br>Apartment No: ' + userData.unit + '<br>Mobile: <a href=\"tel:' + userData.phone + '\">' + userData.phone + '</a><br>Time: ' + moment().format('LLL') + '<br>Title: ' + title;
			this.addnewmessage(message, admin.uId, 'text');
			// this.sendChatMsgNoti(admin.deviceToken, title, admin);
			this.emailServiceReq(message, admin);
			resolve();
			// this.event.publish('serviceReqAdded');
		});
	}
	getAptServiceReqMessage(){
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/aptServiceReqMessage');
			var serviceReqArr = [];
			dbRef.on('value', (data) => {
				if (data.val()) {
					serviceReqArr = _.toArray(data.val());
					// this.event.publish('supportRequpdated');
				}

				resolve(serviceReqArr);
			});
		});
	}
	getAllSupportReq() {
		var userId = this.globals.userId;
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/serviceRequests').orderByChild('uId').equalTo(userId);
			var serviceReqArr = [];
			dbRef.on('value', (data) => {
				if (data.val()) {
					serviceReqArr = _.toArray(data.val());
					// this.event.publish('supportRequpdated');
				}

				resolve(serviceReqArr);
			});
		});
	}
	loadAllAdminSupportReqs() {
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/serviceRequests');
			var allServiceReqArr = [];
			dbRef.on('value', (data) => {
				if (data.val()) {
					allServiceReqArr = _.toArray(data.val());
					// this.globals.allSupportReqs = allServiceReqArr;
					this.event.publish('allSupportRequpdated');
				}

				resolve(allServiceReqArr);
			});
		});
	}
	getAllServiceReqNotes(id) {
		return new Promise((resolve, reject) => {
			var dbRef = firebase.database().ref('/serviceRequests/' + id + '/Notes/');
			var allNotes = [];
			dbRef.on('value', (data) => {

				if (data.val() != 'default') {
					allNotes = _.toArray(data.val());
					// this.removeSelfFromNeighbours(newsArr);
					// console.log('All Neighbours ', newsArr);
					if (allNotes.length > 0) {
						// console.log('users Array ', userArr);
						this.event.publish('newNoteAdded');
						resolve(allNotes);
					} else {
						reject({ msg: 'No notes Found' });
					}
				} else {
					reject({ msg: 'No notes Found' });
				}
			});
		});
	}
	updateNews(newsId, newsData) {
		return new Promise((resolve, reject) => {
			firebase.database().ref('/news/').child(newsId).update({
				news: newsData
			});

			resolve();
		});
	}
	completeSupportReq(id) {
		var dbRef = firebase.database().ref('/serviceRequests').child(id);
		return new Promise((resolve, reject) => {
			dbRef.update({
				status: 'completed'
			}).then(() => {
				resolve();
			});

		});
	}
	addNotesToServiceReq(serviceReq, notes) {
		let time = this.formatAMPM(new Date());
		var userData = this.globals.userData;
		var dbRef = firebase.database().ref('/serviceRequests').child(serviceReq.id + '/Notes').push();

		return new Promise((resolve, reject) => {
			dbRef.set({
				dateofPost: moment().format('DD/MM/YYYY'),
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				time: time,
				note: notes,
				addedBy: this.globals.userId,
				addedByFirstName: userData.firstName,
				addedByLastName: userData.lastName,
				addedByProfile: userData.profileurl,
				id: dbRef.key

			}).then(() => {
				this.events.publish('noteAdded');
				resolve();
			});

		});
	}
	setUnreadMessageCount(unreadMessageCount, userId) {
		var userRef = firebase.database().ref('/users').child(userId);
		userRef.update({
			unreadMessages: unreadMessageCount
		});
	}

	getBuildingInfo() {
		var dbRef = firebase.database().ref('/buildingInfo/');
		var buildingInfo;
		return new Promise((resolve, reject) => {
			dbRef.once('value', (data) => {


				if (data.val() != 'default') {
					buildingInfo = _.toArray(data.val());
					resolve(buildingInfo);
				} else {
					reject({ msg: 'No info found' });
				}

			});
		});
	}
	getHouseRules() {
		var dbRef = firebase.database().ref('/houseRules/');
		var buildingInfo;
		return new Promise((resolve, reject) => {
			dbRef.once('value', (data) => {


				if (data.val() != 'default') {
					buildingInfo = _.toArray(data.val());
					resolve(buildingInfo);
				} else {
					reject({ msg: 'No info found' });
				}

			});
		});
	}

	delete(file) {
		return new Promise((resolve, reject) => {
			let imgUrl = firebase.storage().refFromURL(file);
			// console.log('Image Url Reference => ', imgUrl.fullPath);

			firebase.storage().ref(imgUrl.fullPath).delete().then((data) => {
				console.log('File deleted successfully');
				resolve();
			}).catch((error) => {
				reject();
				// Uh-oh, an error occurred!
			});
			/* OLD firebase.storage().ref(file).delete().then((data) => {
				console.log('File deleted successfully');
				resolve();
			}).catch((error) => {
				reject();
				// Uh-oh, an error occurred!
			}); */
		})
	}
}
