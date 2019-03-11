import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { NavController, Content, NavParams, App, ActionSheetController, LoadingController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-add-news',
  templateUrl: 'add-news.html',
})
export class AddNewsPage {
  editmode: boolean = false;
  editNews: any;
  @ViewChild('newsInput') newsText: ElementRef;
  userData: any;
  news: any;
  newsPicUrl: any = 'Default';
  hasPhoto: boolean = false;
  hasNoContent: boolean = true;
  newsRow: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider, public app: App, private camera: Camera, public actionSheetCtrl: ActionSheetController, public keyboard: Keyboard, private renderer: Renderer, private elementRef: ElementRef, public loadingCtrl: LoadingController) {
    this.editNews = this.navParams.get('news');
    if (this.editNews) {
      console.log('this news can be edited',this.editNews);
      this.news = this.editNews.news;
      this.editmode = true;
      if (this.editNews.newspic != 'default') {
        this.hasPhoto = true;
        this.newsPicUrl = this.editNews.newspic;
      }
    }
    this.userData = this.globals.userData;
    console.log(this.userData);
  }

  ionViewDidEnter() {
    this.openKeyboardSetFocus();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewsPage');
  }


  ionViewWillLeave() {
    // this.keyboard.disableScroll(false);
  }
  back() {
    this.app.getRootNav().pop();
  }
  addContent() {
    if (this.news != null) {
      this.hasNoContent = false;
    }
  }
  addNews() {
    if (this.editmode) {
      this.firebase.editNews(this.userData, this.editNews.id, this.news, this.newsPicUrl).then((data) => {
        console.log('news edited');
        this.navCtrl.pop();
      });
    }
    else {
      this.firebase.addNews(this.userData, this.news, this.newsPicUrl).then((data) => {
        console.log('news added');
        this.navCtrl.pop();
      });
    }
    
  }
  // addPicInNews(){
  //   this.firebase.addNews(this.userData, this.news).then((data) => {
  //     console.log('news added');
  //     this.navCtrl.pop();
  //   });
  // }
  addPhototoNews() {
    document.getElementById('avatar').click();
  }

  upload() {

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();
      this.firebase.uploadPicture(selectedFile).then((data) => {
        this.newsPicUrl = data;
        this.hasPhoto = true;
        if (this.editmode) {
          this.hasNoContent = false;
        }
        loading.dismiss();
      })

    }
  }
  // addPhototoNews(){
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
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: (type == 0) ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then((imageData) => {
      var imageData = imageData;
      this.newsPicUrl = imageData;

      this.firebase.uploadPicture(imageData).then((data) => {
        this.newsPicUrl = data;
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

  resize() {
    // console.log(this.myInput.nativeElement.style.height);
    // console.log(this.myInput.nativeElement.style.height) 
    if (this.newsText.nativeElement.scrollHeight < 115) {
      this.newsText.nativeElement.style.height = this.newsText.nativeElement.scrollHeight + 'px';
    }

    // this.messageRow = this.messageRow + 1;
    // }

  }

}
