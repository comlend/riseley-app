import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, App } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import { AddNewsPage } from '../add-news/add-news';

/**
 * Generated class for the ReportPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report-post',
  templateUrl: 'report-post.html',
})
export class ReportPostPage {

  userId: any;
  news: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: FirebaseProvider, private viewCtrl: ViewController, private toastCtrl: ToastController, public globals: GlobalsProvider,private app: App) {
    this.news = this.navParams.get('news');
    this.userId = this.globals.userId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPostPage');
  }
  reportNews(){
    this.firebase.reportNews(this.news).then(()=>{
      this.presentToast('This post has been reported for admin moderation');
      this.viewCtrl.dismiss();
    })
  }
  deleteNews(){
    this.firebase.deleteNews(this.news.id).then(() => {
      this.presentToast("This post has been deleted");
      this.viewCtrl.dismiss();
    })
  }
  editNews(){
    this.viewCtrl.dismiss();
    this.app.getRootNav().push(AddNewsPage, {news:this.news});
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    // toast.onDidDismiss(() => {
      
    // });

    toast.present();
  }

}
