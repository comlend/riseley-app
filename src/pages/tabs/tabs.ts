import { Component, NgZone } from '@angular/core';

import { MessagesListPage } from '../messages-list/messages-list';
import { NeighboursPage } from '../neighbours/neighbours';
import { NewsPage } from '../news/news';
import { MorePage } from '../more/more';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Events } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {

	chats: any[];
	tab1Root = MessagesListPage;
	tab2Root = NeighboursPage;
	tab3Root = NewsPage;
	tab4Root = MorePage;
	tabIndex: Number = 0;

	unreadMessages: number = 0;
	unreadTabBadge: string = null;
	constructor(private firebase: FirebaseProvider, private globals: GlobalsProvider, public _zone: NgZone, public events: Events, public badge: Badge) {
		//  console.log('neighbours data from globals- ',this.globals.neighboursData);
		// console.log(this.globals.unreadMessages);
		// this.events.subscribe('newmessage', () => {
		// 	this._zone.run(() => {
		// 		this.listenForEvents();		
		// 	});
		// });
		this.listenForEvents();	
		// Update Blocked List
		// this.firebase.getUpdatedBlockedMeList();
	}

	listenForEvents() {
		this.events.subscribe('unread:messages', () => {
			this._zone.run(() => {
				this.unreadMessages = this.globals.unreadMessages;
				this.unreadTabBadge = String(this.globals.unreadMessages);
				if (this.globals.unreadMessages != 0) {
					// alert(this.globals.unreadMessages);
					this.badge.set(this.globals.unreadMessages);
				}
				if (this.globals.unreadMessages == 0) {

					// alert(this.globals.unreadMessages);
					this.badge.clear();
				}
				
				// console.log('Unread Badge ', this.unreadMessages, this.unreadTabBadge);
			});
		});
	}

	
}