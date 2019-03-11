import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsPage } from '../news/news';

/**
 * Generated class for the FirstPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-first',
  templateUrl: 'first.html',
})
export class FirstPage {
  loading: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalsProvider, public splashScreen: SplashScreen, public storage: Storage, public utilities: UtilitiesProvider, public event: Events) {
    
    

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FirstPage');
    // console.log('this user ->', this.global.userId);

    this.loading = true;
    var promises = [this.getUserData(), this.getNeighbours(), this.getAllChats()];
    Promise.all(promises).then((values) => {
      this.extractNeighbourData();
      this.getAllNews();
      this.getAllLocals();
      // this.firebaseProvider.getUpdatedBlockedByMeList();
      // this.firebaseProvider.getUpdatedBlockedMeList();

      if (this.global.userData.unreadMessages) {
        this.storage.set('unreadMessages', this.global.userData.unreadMessages);
      }
      if (this.splashScreen) {
        this.splashScreen.hide();
      }
      
      this.loading = false;
      this.navCtrl.setRoot(TabsPage);

    }).catch((err) => {
      if (this.splashScreen) {
        this.splashScreen.hide();
      }

      this.loading = false;
      this.navCtrl.setRoot(TabsPage);
      
      console.log('Promise.all ', err);
    });
  }

  getUserData() {
    var userId = this.global.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/' + userId);
      var userArr = [];
      dbRef.once('value', (data) => {

        if (data.val() != 'default') {
          userArr = data.val();
          this.global.userData = userArr;
          // console.warn(' Component User Data ', this.global.userData);
          resolve(userArr);
        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    }).catch((err) => {
      console.log('userdata error', err);
    });
  }
  getNeighbours() {
    var userId = this.global.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/');
      var neighboursArr = [];
      dbRef.on('value', (data) => {

        if (data.val() != 'default') {
          neighboursArr = _.toArray(data.val());
          _.remove(neighboursArr, { 'uId': userId });

          // console.log('neighboursArray ', neighboursArr);
          this.global.neighboursData = neighboursArr;
          this.event.publish('neighboursUpdated');

          this.utilities.filterBlockedMeUsers(this.global.userData.blockedMe);
          this.utilities.filterBlockedByMeUsers(this.global.userData.blockedByMe);
          // console.log('filtered users list loaded');
          resolve();

        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    }).catch((err) => {
      console.log('neighbours error', err);
    });;
  }

  getAllChats() {
    return new Promise((resolve, reject) => {
      var userId = this.global.userId;
      // console.log('User ID ', userId);
      var dbRef = firebase.database().ref('chats').child(userId);
      var chatArr = [];
      dbRef.once('value', (chats) => {
        var chatObj = chats.val();
        for (let chat in chatObj) {
          var chatObjTemp = {};

          chatObjTemp['receiver'] = chat;
          chatObjTemp['messages'] = [];
          if (chatObj.hasOwnProperty(chat)) {
            let chatElement = chatObj[chat];
            // console.log('Chat Eele ', chat, _.toArray(chatElement));

            chatObjTemp['messages'] = _.toArray(chatElement);
          }

          chatArr.push(chatObjTemp);
        }

        this.global.chats = chatArr;
        // this.event.publish('new-message');
        // console.log('Chat Arr ', chatArr);
        resolve(chatArr);
        
      }).catch((err) => {
        console.log('chat error', err);
        reject(err);
      });
    }).catch((err) => {
      console.log('chat error', err);
    });;
  }

  getAllLocals() {
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/locals/');
      var localsArr = [];
      dbRef.on('value', (data) => {
        if (data.val() != 'default') {
          localsArr = _.toArray(data.val()).reverse();
          this.global.locals = localsArr;
          // console.log('all localss in globals', this.global.locals);
          this.event.publish('localsupdated');

          resolve();

        } else {
          reject();
        }
      });
    }).catch((err) => {
      console.log('locals error', err);
    });;
  }

  getAllNews() {
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/news/');
      var newsArr = [];
      var comments = [];
      dbRef.on('value', (data) => {

        if (data.val() != 'default') {
          newsArr = _.toArray(data.val()).reverse();
          this.global.news = newsArr;
          // console.log('all news in globals', this.global.news);
          this.event.publish('newsupdated');
          // for (let index = 0; index < newsArr.length; index++) {
          //   var news = newsArr[index];
          //   var custNewsData = {};

          //   if (news.hasOwnProperty('comments')) {
          //     var commentKeys = Object.keys(news.comments);
          //     var commentsNumber = Object.keys(news.comments).length;
          //     var lastCommentKey = commentKeys[commentsNumber - 1];

          //     var lastComment = news.comments[lastCommentKey];
          //     // console.log('Last Comment ', lastComment)
          //     custNewsData['commentsNumber'] = commentsNumber;
          //     custNewsData['lastComment'] = lastComment;
          //     news.custNewsData = custNewsData;
          //   }

          //   if (news.hasOwnProperty('likes')) {
          //     var likesNumber = Object.keys(news.likes).length;
          //     custNewsData['likes'] = _.toArray(news.likes);
          //     custNewsData['likesNumber'] = likesNumber;
          //     news.custNewsData = custNewsData;
          //   }
          //   // console.log('News Modified Data Form ', news);
          //   // if (newsArr[index].id == newsArr[index].comments.newsId) {
          //   // comments.push(_.toArray(newsArr[index].comments.length));
          //   // }
          // }
          // console.log('all comments',comments);
          resolve();

        } else {
          reject();
        }
      });
    }).catch((err) => {
      console.log('news error', err);
    });;
  }

  extractNeighbourData() {
    // console.log(this.global.neighboursData, this.global.chats);

    return new Promise((resolve, reject) => {
      if (this.global.chats) {
        for (let i = 0; i < this.global.chats.length; i++) {
          let chat = this.global.chats[i];
          let receiver = chat.receiver;

          for (let j = 0; j < this.global.neighboursData.length; j++) {
            let eachNeighbour = this.global.neighboursData[j];
            let neighbourId = eachNeighbour.uId;
            if (receiver == neighbourId) {
              chat.receiverData = eachNeighbour;

              break;
            }
          }
        }
        resolve();
      }
    }).catch((err) => {
      console.log('neighbour chat error', err);
    });;

    // console.log('All Chats Modified ', this.global.chats);

  }

}
