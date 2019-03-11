import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the NewServiceReqAptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-service-req-apt',
  templateUrl: 'new-service-req-apt.html',
})
export class NewServiceReqAptPage {
  loading: boolean;
  title: any;
  details: any;
  picAdded: boolean = false;
  reqPicture: any = [];
  userData: any;
  allRequests: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider) {
    this.userData = this.globals.userData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewServiceReqAptPage');
  }
  back() {
    this.navCtrl.pop();
  }
  submitRequest() {
    this.firebase.addServiceReqApartment(this.userData, this.title, this.details, this.reqPicture).then((data) => {
      console.log('appartment request added');
      this.navCtrl.pop();
    });
  }
  addPhotoRequest() {
    document.getElementById('avatar').click();
  }
  upload() {

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      this.loading = true;
      this.picAdded = true;
      this.firebase.uploadPicture(selectedFile).then((data) => {
        // this.reqPicture = data;
        this.reqPicture.push(data);
        // this.picAdded = true;
        this.loading = false;
        var imageData = data;
      }).catch((err) => {
        console.log('Camera Error ', err);
      });
      console.log("image array", this.reqPicture);
    }

  }
  deleteImage(index, photo) {
    this.reqPicture.splice(index, 1);
    // console.log('IMAGE FILE => ', photo.image);
    this.firebase.delete(photo.image);
  }

}
