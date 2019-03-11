import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { Events } from 'ionic-angular';

@Injectable()
export class EventDispatcherProvider {

	constructor(public http: HttpClient, public events: Events) {
		console.log('Hello EventDispatcherProvider Provider');
		// this.initializeAllEvent();
	}

	initializeAllEvent() {
		this.newUserAdded();
	}

	newUserAdded() {
		return new Promise((resolve) => {
			// console.log('New User Add Event Initialised');
			var dbRef = firebase.database().ref('/users').limitToLast(1);
			dbRef.on('child_added', (data) => {
				// alert('New User Added event-dispatcher');
				resolve();
				this.events.publish('user:added');
			});
		});
	}
}
