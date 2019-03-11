import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalsProvider } from '../globals/globals';

import * as _ from 'lodash';

@Injectable()
export class UtilitiesProvider {

	constructor(public http: HttpClient, public globals: GlobalsProvider) {
		console.log('Hello UtilitiesProvider Provider');
	}

	filterBlockedMeUsers(blockedListids) {
		
		var blockedMe = blockedListids;

		var neighbours = _.cloneDeep(this.globals.neighboursData);
		var extracted = [];
		console.log('blocked users utulities list loaded');

		if (blockedMe != 'default') {
			var blockedMeUsers = _.toArray(blockedMe);

			// console.log('Run Blocked Me', blockedMeUsers, this.globals.neighboursData);

			_.map(blockedMeUsers, (user) => {
				// console.log('Blocked Me Users => ', user.id);
				extracted.push(_.find(neighbours, { 'uId': user.id }));
			});
			this.globals.blockedMe = extracted;
			// console.log('Blocked Me => ', extracted);
			
		}
	}

	filterBlockedByMeUsers(blockedListids) {
		var iBlocked = blockedListids;

		var neighbours = _.cloneDeep(this.globals.neighboursData);
		var extracted = [];
		console.log('blocked by me users utilities list loaded');
		if (iBlocked != 'default') {
			var iBlockedUsers = _.toArray(iBlocked);
			// console.log('Run Blocked I', iBlockedUsers, this.globals.neighboursData);

			_.map(iBlockedUsers, (user) => {
				// console.log('Blocked By Me Users => ', user.id);
				extracted.push(_.find(neighbours, { 'uId': user.id }));
			});

			this.globals.blockedByMe = extracted;

			// console.log('Blocked By Me UTI => ', extracted);
			
		}
	}

}
