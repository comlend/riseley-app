import { Component, Renderer, ElementRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the AddLocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-local',
  templateUrl: 'add-local.html',
})
export class AddLocalPage {
  userData: any;
  local: any;
  localName: any;
  hasNoContent: boolean = true;
  localPicUrl: any = 'Default';
  hasPhoto: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public globals: GlobalsProvider, public actionSheetCtrl: ActionSheetController, public camera: Camera, public keyboard: Keyboard, private renderer: Renderer, private elementRef: ElementRef) {
    this.userData = this.globals.userData;
  }
  back(){
    this.navCtrl.pop();
  }

  ionViewDidEnter() {
    this.openKeyboardSetFocus();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddLocalPage');
  }

  ionViewWillLeave() {
    // this.keyboard.disableScroll(false);
  }

  addContent() {
    if (this.local != null || this.localPicUrl != 'Default') {
      this.hasNoContent = false;
    }
  }

  addLocal() {
    this.firebase.addLocal(this.userData, this.local, this.localName, this.localPicUrl).then((data) => {
      console.log('local item added');
      this.navCtrl.pop();
    });
  }
  
  addPhototoLocal(){
    document.getElementById('avatar').click();
  }

  upload() {

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {

      this.firebase.uploadPicture(selectedFile).then((data) => {
        this.localPicUrl = data;
        this.hasPhoto = true;
      }).catch((err) => {
        console.log('Camera Error ', err);
      });

    }
  }
  // addPhototoLocal(){

  //   let actionSheet = this.actionSheetCtrl.create({
  //     buttons: [
  //       {
  //         text: 'Take Photo',
  //         handler: () => {
  //           this.selectImage(0);
  //         }
  //       },
  //       {
  //         text: 'Choose from Library',
  //         handler: () => {
  //           this.selectImage(1);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   actionSheet.present();
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
      var imageData = imageData;
      this.localPicUrl = imageData;

      this.firebase.uploadPicture(imageData).then((data) => {
        this.localPicUrl = data;
        console.log('Camera Data ', data);
        this.hasPhoto = true;

      })
        .catch((err) => {
          console.log('Camera Error ', err);
        });
    });
  }

  openKeyboardSetFocus() {
    // this.keyboard.disableScroll(true);

    setTimeout(() => {
      // Set Focus
      let ele = this.elementRef.nativeElement.querySelector('textarea');
      this.renderer.invokeElementMethod(ele, 'focus', []);

      // Open Keyboard
      this.keyboard.show();
    }, 150);
  }

}
