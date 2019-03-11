import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TncPage } from '../tnc/tnc';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { FirstPage } from '../first/first';
/**
 * Generated class for the RegisterOwnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-register-owner',
	templateUrl: 'register-owner.html',
})
export class RegisterOwnerPage {
	public signupForm;
	user: { firstName?: any, lastName?: any, email?: any, pass?: any } = {};
	formData: any;
	loading: any;
	errormessage: any;
	returnInvalid: boolean = false;
	profileurl: any = '';

	imageData: any;
	userType: string = "owner";
	liveInProperty: boolean;
	showPassError: boolean = true;
	picUploaded: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public firebase: FirebaseProvider, public loadingCtrl: LoadingController, private camera: Camera, public actionSheetCtrl: ActionSheetController, public fcm: FCM, public storage: Storage) {
		this.initializeForm();
		this.profileurl = 'assets/imgs/imgPlaceholder.png';
	}

	initializeForm(): void {
		this.signupForm = this.formBuilder.group({
			firstName: ['', Validators.compose([Validators.required])],
			lastName: ['', Validators.compose([Validators.required])],
			unit: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
			mobile: ['', Validators.compose([Validators.required])]

		});

	}
	checkVal() {
		//Check form value for empty
		if (this.signupForm.controls.unit.value == '' || this.signupForm.controls.mobile.value == '') {
			this.returnInvalid = false;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterOwnerPage');
	}
	back() {
		this.navCtrl.pop();
	}
	gotoTerms() {
		this.navCtrl.push(TncPage);
	}
	gotoPolicy() {
		this.navCtrl.push(PrivacyPolicyPage);
	}

	checkPassLength() {
		if (this.user.pass.length < 6) {
			this.showPassError = true;
		}
		else
			this.showPassError = false;
	}

	signupUser() {
		this.formData = this.signupForm.value;
		// console.log('Run signupUser');
		// console.log( "data output",this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstName, this.signupForm.value.lastName, createdAt, this.profileurl)

		// this.returnInvalid = true;

		var createdAt = moment().format();

		if (!this.imageData) {
			this.imageData = this.profileurl;
		}

		if (!this.signupForm.controls.firstName.valid || !this.signupForm.controls.lastName.valid ||
			!this.signupForm.controls.email.valid || !this.signupForm.controls.password.valid ||
			!this.signupForm.controls.unit.valid || !this.signupForm.controls.mobile.valid) {
			this.returnInvalid = true;
			return;
		} else {
			this.firebase.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstName, this.signupForm.value.lastName, createdAt, this.userType, this.signupForm.value.unit, this.imageData, this.signupForm.value.mobile)
			.then((data) => {
				console.log('test', data);
				this.loading.dismiss();

				/* this.loading.dismiss().then(() => {

					this.navCtrl.setRoot(TabsPage);
				}); */
			}, (error) => {
				this.loading.dismiss().then(() => {
					this.errormessage = error.message;
					this.returnInvalid = true;

				});
			});

		}
		
		this.loading = this.loadingCtrl.create({ content: 'Signing you up..' });
		this.loading.present();
	}

	// uploadImage() {
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

	// selectImage(type) {
	// 	let options: CameraOptions = {
	// 		quality: 90,
	// 		targetWidth: 100,
	// 		targetHeight: 100,
	// 		allowEdit: true,
	// 		destinationType: this.camera.DestinationType.DATA_URL,
	// 		encodingType: this.camera.EncodingType.JPEG,
	// 		mediaType: this.camera.MediaType.PICTURE,
	// 		sourceType: (type == 0) ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
	// 	};

	// 	this.camera.getPicture(options).then((imageData) => {
	// 		this.imageData = imageData;
	// 		this.profileurl = 'data:image/png;base64,' + imageData;
	// 		this.picUploaded = true;
	// 	});
	// }


	uploadImage() {
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
			this.profileurl = preview.src;
			this.imageData = selectedFile;
			this.picUploaded = true;
		}
	}
	
}
