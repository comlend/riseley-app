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


@Component({
	selector: 'page-register-business',
	templateUrl: 'register-business.html',
})
export class RegisterBusinessPage {
	public signupFormBiz;
	user: { firstName?: any, lastName?: any, email?: any, pass?: any, name?: any, details?: any, mobile?: any } = {};
	formData: any;
	loading: any;
	errormessage: any;
	returnInvalid: boolean = false;
	profileurl: any = '';
	imageData: any;
	userType: string = "business";
	liveInProperty: boolean = false;
	showPassError: boolean = true;
	picUploaded: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public firebase: FirebaseProvider, public loadingCtrl: LoadingController, private camera: Camera, public actionSheetCtrl: ActionSheetController, public fcm: FCM, public storage: Storage) {
		this.initializeForm();
		this.profileurl = 'assets/imgs/imgPlaceholder.png';
	}
	initializeForm(): void {
		this.signupFormBiz = this.formBuilder.group({
			firstName: ['', Validators.compose([Validators.minLength(1),Validators.required])],
			lastName: ['', Validators.compose([Validators.required])],
			name: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
			mobile: ['', Validators.compose([Validators.minLength(9),Validators.required])],
			details: ['', Validators.compose([Validators.required])],
		});

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterBusinessage');
	}
	back() {
		this.navCtrl.pop();
	}
	gotoTerms(){
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
	checkVal() {
		//Check form value for empty
		if (this.signupFormBiz.controls.name.value == '' || this.signupFormBiz.controls.details.value == '' || this.signupFormBiz.controls.mobile.value == '') {
			this.returnInvalid = false;
		}
	}

	signupUser() {
		this.formData = this.signupFormBiz.value;
		// console.log('Run signupUser');
		// console.log( "data output",this.signupFormBiz.value.email, this.signupFormBiz.value.password, this.signupFormBiz.value.firstName, this.signupFormBiz.value.lastName, createdAt, this.profileurl)

		// this.returnInvalid = true;

		var createdAt = moment().format();

		if (!this.imageData) {
			this.imageData = this.profileurl;
		}

		if (!this.signupFormBiz.controls.firstName.valid || !this.signupFormBiz.controls.lastName.valid ||
			!this.signupFormBiz.controls.email.valid || !this.signupFormBiz.controls.password.valid ||
			!this.signupFormBiz.controls.name.valid || !this.signupFormBiz.controls.details.valid || !this.signupFormBiz.controls.mobile.valid) {
			this.returnInvalid = true;
			return;
		} else {
			this.firebase.signupBizUser(this.signupFormBiz.value.email, this.signupFormBiz.value.password, this.signupFormBiz.value.firstName, this.signupFormBiz.value.lastName, createdAt, this.profileurl, this.signupFormBiz.value.name, this.userType, this.signupFormBiz.value.details, this.imageData, this.signupFormBiz.value.mobile)
				.then((data) => {
					console.log('user signed up', data);
					this.loading.dismiss();
					// .then(() => {

					// 	this.navCtrl.setRoot(TabsPage);
					// });
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
			this.imageData = imageData;
			this.profileurl = 'data:image/png;base64,' + imageData;
			this.picUploaded = true;
			// this.firebase.uploadProfile(imageData).then((data) => {
			//   // this.profileurl = data;
			//   console.log(data);

			// })
			// .catch((err) => {
			//   console.log(err);
			// });
		});
	}
	
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
	
	clearErrors() {

	}

	register() {

	}

}
