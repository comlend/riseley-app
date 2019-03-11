import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import * as _ from 'lodash';

@Component({
	selector: 'page-add-blocked-users',
	templateUrl: 'add-blocked-users.html',
})
export class AddBlockedUsersPage {
	blockedUsers: any;
	neighbours: any = [];
	query: string = '';
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider, public _zone: NgZone) {
		this.initializeStartData();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddBlockedUsersPage');
	}

	initializeStartData() {
		var neighbours = _.cloneDeep(this.globals.neighboursData);

		this._zone.run(() => {
			this.neighbours = this.removeAlreadyBlocked(neighbours);
		});
	}

	removeAlreadyBlocked(neighbours) {
		var blockedByMe = this.globals.blockedByMe;
		console.log('Blocked By Me Before => ', neighbours);

		_.map(blockedByMe, (user) => {
			console.log(user);
			_.remove(neighbours, { 'uId': user.uId });
		});
		console.log('Blocked By Me After => ', neighbours);
		return neighbours;
	}

	back() {
		this.navCtrl.pop();
	}

	onInputSearch(event) {
		console.log('Query String ', this.query);
	}
	onCancelSearch(event) {
		this.query = '';
	}

	blockNeighbour(neighbourToBlock) {
		this.firebase.blockNeighbour(neighbourToBlock).then(() => {
			_.remove(this.neighbours, { 'uId': neighbourToBlock.uId });
			console.log('Blocked');
			this.navCtrl.pop();
		}).catch((err) => {
			console.log('Neighbour Block Error => ', err);
		})
	}

}
