// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsProvider {
	userId: any;
	userData: any;
	neighboursData: any;
	FbLoginComplete: boolean = true;
	news: any;
	locals: any;
	chats = [];
	fcmToken: string = '';
	cordovaPlatform: boolean = null;
	unreadMessages: number = 0;

	blockedMe: any = [];
	blockedByMe: any = [];
	pwaDeviceToken: string = '';

	constructor() {
		console.log('Hello GlobalsProvider Provider');
	}

	clear() {
		this.userId = undefined;
		this.userData = undefined;
		this.chats = undefined;
		this.neighboursData = undefined;
		this.cordovaPlatform = undefined;
		this.unreadMessages = undefined;
		this.news = undefined;
		this.locals = undefined;
		this.blockedMe = undefined;
		this.blockedByMe = undefined;
	}

	reinitializeGlobals() {
		this.userId = '';
		this.userData = '';
		this.chats = [];
		this.neighboursData = [];
		this.cordovaPlatform = null;
		this.unreadMessages = 0;
		this.news = [];
		this.locals = [];
		this.blockedMe = [];
		this.blockedByMe = [];
	}

}
