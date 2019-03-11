import { Component, ViewChild, NgZone, ElementRef, Renderer } from '@angular/core';
import { NavController, NavParams, Content, Events, ActionSheetController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { Keyboard } from '@ionic-native/keyboard';

@Component({
	selector: 'page-message',
	templateUrl: 'message.html',
})
export class MessagePage {
	@ViewChild('chatMessage') myInput: ElementRef;
	@ViewChild('content') content: Content;
	@ViewChild('footer') footerDiv: ElementRef;
	@ViewChild('messageDiv') messageDiv: ElementRef;
	neighbourData: any;
	chat: any = '';
	chats: any;
	userId: string;
	userProfile: any;
	imageData: any;
	messageRow: number = 1;

	compensateUnreadMsg: number = 0;
	// imgornot: any = '';

	constructor(public navCtrl: NavController, public firebase: FirebaseProvider, public navParams: NavParams, public zone: NgZone, public events: Events, public globals: GlobalsProvider, public actionSheetCtrl: ActionSheetController, private camera: Camera, public keyboard: Keyboard, private renderer: Renderer, private elementRef: ElementRef) {

		this.userId = this.globals.userId;
		this.userProfile = this.globals.userData.profileurl;

		this.neighbourData = this.navParams.get('neighbour');
		// console.log('neighbors data', this.neighbourData);
		this.compensateUnreadMsg = this.navParams.get('unreadCompensation');

		console.log(/* 'Neighbour Data ', this.neighbourData,  */' Unread Compensation ', this.compensateUnreadMsg);
		// this.scrollto();
		
		this.firebase.getnewMsg(this.neighbourData.uId).then((message) => {
			// console.log('Why i am not running');
			// this.imgornot = [];
			this.zone.run(() => {
				// console.log('Remember me ')
				// console.log(message);
				this.chats = message;
				this.scrollto();
			});							
		});		
		
		this.listenForEvents();
	}

	ionViewWillEnter() {
		this.compensateUnreadMessagesVal();
	}

	ionViewDidEnter() {
		this.openKeyboardSetFocus();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MessagePage');
	
		this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
			this.zone.run(() => {
				console.log('counter Message Arr', data);
			});

			
			// this.chats = this.firebase.neighbourmessages;					
			this.chats = data;
			this.checkForUnreadMsgs();
		}).catch((err) => {
			console.log('Error ', err);
		});		
	}

	ionViewWillLeave() {
		// this.keyboard.disableScroll(false);
		this.keyboard.onKeyboardHide().subscribe(() => {
			if (this.footerDiv && this.footerDiv.nativeElement)
				this.footerDiv.nativeElement.style.bottom = "0px";
		});
	}

	back(){
		this.navCtrl.pop();
	}

	addnewmessage(chat, type) {
		this.chat = '';
		this.myInput.nativeElement.style.height = '20px';
		console.log('Chat Before ', chat, this.neighbourData.uId);
		this.firebase.addnewmessage(chat, this.neighbourData.uId, type).then(success => {
			// this.chats = userData;
			this.chat = '';
			this.myInput.nativeElement.style.height = '20px';
			console.warn(success);
		}, error => {
			this.chat = '';
			this.myInput.nativeElement.style.height = '20px';
			console.error(error);
		});
	}

	sendChatNotification(msg) {
		var neighbourDeviceToken = this.neighbourData.deviceToken;
		var neighbourData = this.neighbourData;
		// console.log('Chat and Neighbour Device Token ', msg, neighbourDeviceToken);
		if (this.neighbourData.showMessageNotification){
			this.firebase.sendChatMsgNoti(neighbourDeviceToken, msg, neighbourData).then(() => {
				console.log('Notification Sent.');
			});
		}
		else{
			console.log('no message notification is to be sent');
		}
	}

	// getAllMessages() {
	//  this.firebase.getneighbourmessages(this.neighbourData.uId).then(success => {
	//     // console.log(success);
	//     console.warn(success);
	//   }, error => {
	//     console.error(error);
	//   });;
	//       console.log(this.chats);

	// }

	scrollto() {
		if (this.content) {
			setTimeout(() => {
				this.content.scrollToBottom();
			}, 1500);	
		}
	}

	listenForEvents() {
		this.events.subscribe('newmessage', () => {
			this.chats = [];
			
			this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
				this.zone.run(() => {
					console.log('counter Message Arr', data);
					this.chats = data;	
					
				});				
				this.scrollto();
				
				// this.chats = this.firebase.neighbourmessages;					
			}).catch((err) => {
				console.log('Error ', err);
			});
		});

		this.events.subscribe('chatstatus:updated', () => {
			this.firebase.getneighbourmessages(this.neighbourData.uId).then((data) => {
				this.zone.run(() => {
					console.log('counter Message Arr', data);
				});


				// this.chats = this.firebase.neighbourmessages;					
				this.chats = data;
				this.checkForUnreadMsgs();
			}).catch((err) => {
				console.log('Error ', err);
			});	
		});

		this.updateMsgFirebaseCallbackEvent();
	}
	uploadPic(){
		document.getElementById('avatar').click();
	}

	upload() {

		for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {

			this.firebase.uploadMessagePic(selectedFile).then((data) => {
				this.imageData = data;
				var type = 'image';
				this.addnewmessage(data, type);
			}).catch((err) => {
				console.log('Camera Error ', err);
			});

		}
	}

	// uploadPic(){
	// 	let actionSheet = this.actionSheetCtrl.create({
	// 		buttons: [
	// 			{
	// 				text: 'Take Photo',
	// 				handler: () => {
	// 					this.selectImage(0);
	// 				}
	// 			},
	// 			{
	// 				text: 'Choose from Library',
	// 				handler: () => {
	// 					this.selectImage(1);
	// 				}
	// 			},
	// 			{
	// 				text: 'Cancel',
	// 				role: 'cancel'
	// 			}
	// 		]
	// 	});
	// 	actionSheet.present();
	// }
	selectImage(type) {
		let options: CameraOptions = {
			quality: 90,
			targetWidth: 300,
			targetHeight: 300,
			allowEdit: true,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: (type == 0) ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
		};

		this.camera.getPicture(options).then((imageData) => {
			this.imageData = imageData;
			this.firebase.uploadMessagePic(imageData).then((data) => {
				// this.profileurl = data;
				// this.chat = data;
				var type = 'image';
				this.addnewmessage(data,type);
				console.log(data);

			})
				.catch((err) => {
					console.log(err);
				});
		});
	}

	checkForUnreadMsgs() {
		var allChats = this.chats;

		for (let i = 0; i < allChats.length; i++) {
			let chat = allChats[i];

			if (this.userId != chat.sentby) {		
				// Update Chat status once, receiver open this page
				this.updateMsgStatus(chat);

				// console.log('Chat After ', chat);
			}			
		}
	}

	updateMsgStatus(chat) {
		var userId = this.userId;
		var neighbourId = this.neighbourData.uId;
		/* chat.status = 'Read'; */

		// Call Firebase and update db aswell
		this.firebase.updateChatMsgStatus(userId, neighbourId, chat);
	}

	updateMsgFirebaseCallbackEvent() {
		var userId = this.userId;
		var neighbourId = this.neighbourData.uId;
		this.firebase.chatMsgStatusUpdate(userId, neighbourId);
	}

	compensateUnreadMessagesVal() {
		console.log('Total Uread => ', this.globals.unreadMessages, 'Unread To Remove => ', this.compensateUnreadMsg);
		// this.globals.unreadMessages = this.globals.unreadMessages - this.compensateUnreadMsg;
		this.events.publish('unread:messages');
		console.log('Unread After Compensation ', this.globals.unreadMessages);
	}


	resize() {
		// console.log(this.myInput.nativeElement.style.height);
		// console.log(this.myInput.nativeElement.style.height) 
		if (this.myInput.nativeElement.scrollHeight < 115) {
			this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
			}
			
		// this.messageRow = this.messageRow + 1;
		// }
		
	}

	openKeyboardSetFocus() {
		// this.keyboard.disableScroll(true);
		// this.scrollto();

		setTimeout(() => {
			// Set Focus
			// let ele = this.elementRef.nativeElement.querySelector('textarea');
			// this.renderer.invokeElementMethod(ele, 'focus', []);

			// Open Keyboard
			// this.keyboard.show();
			this.keyboard.onKeyboardShow().subscribe(data => {
				if (this.footerDiv && this.footerDiv.nativeElement) {
					this.footerDiv.nativeElement.style.bottom = data.keyboardHeight + "px";
				}
				if (this.messageDiv && this.messageDiv.nativeElement) {
					
					this.messageDiv.nativeElement.style.marginBottom = 65 + data.keyboardHeight + "px";
					console.log(this.messageDiv.nativeElement.style);
					this.scrollto();
					// this.content.scrollToBottom();

				}

			});
			this.keyboard.onKeyboardHide().subscribe(() => {
				if (this.footerDiv && this.footerDiv.nativeElement)
					this.footerDiv.nativeElement.style.bottom = "0px";
				
				if (this.messageDiv && this.messageDiv.nativeElement) {
					this.messageDiv.nativeElement.style.marginBottom = "72px";
				}
			});
		}, 150);
	}
}
