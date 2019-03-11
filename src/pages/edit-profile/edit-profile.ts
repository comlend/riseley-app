import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import * as _ from 'lodash';
import * as firebase from 'firebase'; 

@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
	@ViewChild('bizTextarea') bizTextarea: ElementRef;

	userData: any;
	profileurl: any;
	fullName: any;
	valueChange: boolean = true;

	nameChange: boolean = null;
	numberChange: boolean = null;

	bizNameChange: boolean = null;
	bizDetailsChange: boolean = null;

	

	oldName: string = '';
	oldNumber: string = '';

	oldBizName: string = '';
	oldBizDetails: string = '';

	hideProfile: boolean;

	constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public actionSheetCtrl: ActionSheetController, public camera: Camera, public firebase: FirebaseProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
		this.userData = _.cloneDeep(this.globals.userData);
		console.log(this.userData);
		this.profileurl = this.globals.userData.profileurl;
		this.fullName = this.globals.userData.firstName + ' ' + this.globals.userData.lastName;

		this.hideProfile = this.globals.userData.hideProfile;

		if (this.fullName) {
			this.oldName = this.fullName;
		}

		if (this.userData.phone) {
			this.oldNumber = this.userData.phone;			
		}

		if (this.userData.name) {
			this.oldBizName = this.userData.name;
		}

		if (this.userData.details) {
			this.oldBizDetails = this.userData.details;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditProfilePage');

		setTimeout(() => {
			this.resizeTextarea();
			
		}, 100);
	}
	back() {
		this.navCtrl.pop();
	}

	valueChanged(event, type) {
		console.log(this.valueChange, type);
		// console.log('Event ', event);
		// Now we only need to handle if any value is empty or not
		if (this.fullName == '' || this.userData.phone == '' || this.userData.name == '' || this.userData.details == '' || this.userData.unit == '') {
			this.valueChange = true;
		} else {
			this.valueChange = false;
		}
		

		// Lot of conditions need to be handled, its good if we activate the update button even if single value changes, changed to above code
		/* if (type == 'name') {
			if (this.fullName == '') {
				this.nameChange = false;
			} else {
				if (this.fullName == this.oldName) {
					// console.log('ifname ', this.fullName, this.oldName);
					this.nameChange = false;
				} else {
					// console.log('elsename ', this.fullName, this.oldName);

					this.nameChange = true;
				}
			}
		} else if (type == 'number') {
			if (this.userData.phone == '') {
				this.numberChange = false;
			} else {
				if (this.oldNumber == this.userData.phone) {
					// console.log('ifnum ', this.oldNumber, this.userData.phone);
					this.numberChange = false;
				} else {
					// console.log('elsenum ', this.oldNumber, this.userData.phone);
					this.numberChange = true;
				}
			}
		} else if (type == 'bizName') {
			if (this.userData.name == '') {
				this.bizNameChange = false;
			} else {
				if (this.oldBizName == this.userData.name) {
					console.log('ifnum ', this.oldBizName, this.userData.name);
					this.bizNameChange = false;
				} else {
					console.log('elsenum ', this.oldBizName, this.userData.name);
					this.bizNameChange = true;
				}
			}
		} else if (type == 'bizDetails') {
			if (this.userData.details == '') {
				this.bizDetailsChange = false;
			} else {
				if (this.oldBizDetails == this.userData.details) {
					console.log('ifnum ', this.oldBizDetails, this.userData.details);
					this.bizDetailsChange = false;
				} else {
					console.log('elsenum ', this.oldBizDetails, this.userData.details);					
					this.bizDetailsChange = true;
				}
			}
		} 


		switch (true) {
			case (this.nameChange && this.numberChange && this.bizNameChange && this.bizDetailsChange):
				// console.log('1', this.nameChange, this.numberChange);
				this.valueChange = false;
				break;

			case (this.nameChange && !this.numberChange):
				// console.log('2',this.nameChange, this.numberChange);
				this.valueChange = false;

				break;

			case (!this.nameChange && this.numberChange):
				// console.log('3',this.nameChange, this.numberChange);
				if (this.nameChange == null && this.numberChange) {
					this.valueChange = false;					
				} else if (!this.nameChange && this.numberChange) {
					this.valueChange = false;
				} else if (!this.nameChange) {
					this.valueChange = true;					
				} else {
					this.valueChange = false;
				}

				break;

			case (!this.nameChange && !this.numberChange):
				// console.log('4',this.nameChange, this.numberChange);
				this.valueChange = true;

				break;
		
			default:
				console.log('No Case Found');
				break;
		} */
	}

	// editPhoto() {

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
	
	editPhoto() {
		document.getElementById('avatar').click();
	}

	upload() {

		for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
			var reader = new FileReader();
			var preview = <HTMLInputElement>document.getElementById('pImage');

			reader.onload = (function (selectedFile) {
				preview.src = reader.result;
			});
			if (selectedFile) {
				reader.readAsDataURL(selectedFile);
			}
			
			var uid = this.globals.userId;
			var filename = Date.now() + '.png';

			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});

			loading.present();
			
			this.firebase.updateUserPic(selectedFile, this.userData.uId).then((data) => {
				this.profileurl = data;
				this.globals.userData.profileurl = this.profileurl;
				loading.dismiss();
			}).catch((error)=>{
				loading.dismiss();
				
				let toast = this.toastCtrl.create({
					message: 'Some unexpected error occured, please try again later',
					duration: 5000,
					position: 'bottom'
				});
				toast.present();

			});

		}
	}
	selectImage(type) {
		let options: CameraOptions = {
			quality: 90,
			targetWidth: 100,
			targetHeight: 100,
			allowEdit: true,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: (type == 0) ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
		};

		this.camera.getPicture(options).then((imageData) => {
			var imageData = imageData;
			// this.profileurl = imageData;

			this.firebase.updateUserPic(imageData, this.userData.uId).then((data) => {
				this.profileurl = data;
				this.globals.userData.profileurl = this.profileurl;
			})
				.catch((err) => {
					console.log('Camera Error ', err);
				});
		});
	}

	updateDetails() {
		var firstName;
		var lastName;

		if (!(this.fullName.indexOf(' ') >= 0)) {
			firstName = this.fullName.substr(this.fullName.indexOf(' ') + 1);
			lastName = " ";
		} else {
			firstName = this.fullName.substr(0, this.fullName.indexOf(' '));
			lastName = this.fullName.substr(this.fullName.indexOf(' ') + 1);
		}
		if (this.globals.userData.userType == 'business') {
			this.firebase.updateBusinessUserData(firstName, lastName, this.userData.phone, this.userData.name, this.userData.details, this.userData.uId).then(()=>{
				this.globals.userData.firstName = firstName;
				this.globals.userData.lastName = lastName;
				this.globals.userData.phone = this.userData.phone;
				this.globals.userData.name = this.userData.name;
				this.globals.userData.details = this.userData.details;
				this.valueChange = true;

				let alert = this.alertCtrl.create({
					title: 'User Profile',
					subTitle: 'User Profile has been updated',
					buttons: [
						{
							text: 'Ok',
							role: 'cancel'
						}
					]
				});
				alert.present();

			});
		}
		else {
			this.firebase.updateUserData(firstName, lastName, this.userData.phone, this.userData.unit, this.userData.uId).then(() => {
				console.log('user data updated');
				this.globals.userData.firstName = firstName;
				this.globals.userData.lastName = lastName;
				this.globals.userData.phone = this.userData.phone;
				this.globals.userData.unit = this.userData.unit;
				this.valueChange = true;
				let alert = this.alertCtrl.create({
					title: 'User Profile',
					subTitle: 'User Profile has been updated',
					buttons: [
						{
							text: 'Ok',
							role: 'cancel'
						}
					]
				});
				alert.present();

			});
		}
		
	}

	hideMyProfile(event) {
		this.hideProfile = event.value;
		this.globals.userData.hideProfile = event.value;
		this.firebase.hideMyProfile(this.hideProfile).then(() => {
			console.log('Profile Updated',event.value);
		});
	}

	resizeTextarea() {
		console.log('Text Area Scroll Height', this.bizTextarea.nativeElement.scrollHeight);

		this.bizTextarea.nativeElement.style.height = this.bizTextarea.nativeElement.scrollHeight + 'px';
	}
}
