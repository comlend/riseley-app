import { Component } from '@angular/core';
import { NavController, NavParams, App} from 'ionic-angular';
import { ServiceCenter2Page } from '../service-center2/service-center2';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { MessagePage } from '../message/message';
import { GlobalsProvider } from '../../providers/globals/globals';
import { ServiceCenterAptPage } from '../service-center-apt/service-center-apt';

/**
 * Generated class for the ServiceCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-service-center',
  templateUrl: 'service-center.html',
})
export class ServiceCenterPage {
  users: any;
  allRequests: any;
  inProgressReqs: any = [];
  completedReqs: any = [];
  inProgArrayLength: any =3;
  completedArrayLength: any =3;
  allInProgressReqsShown: boolean = false;
  allCompletedReqsShown: boolean = false;
  loading: any; 
  userType: any;
  noServReq: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, private app: App, private globals: GlobalsProvider) {
    this.users = this.globals.neighboursData;
    // console.error(this.users);
    // this.getAllReq();
    // this.loading = this.loadingCtrl.create({ content: 'Loading all service requests..' });
    // this.userType = this.globals.userData.userType;
    // console.log('this user is - ',this.userType)
  }

  ionViewDidLoad() {
    // this.getAllNeighbours();
    // console.log('ionViewDidLoad ServiceCenterPage');
  }
  back(){
    this.navCtrl.pop();
  }
  newRequestcommon(){
    // console.log(commonArea);
    this.navCtrl.push(ServiceCenter2Page);
    // this.navCtrl.push(NewServiceRequestPage);
  }
  newRequestApt() {
    // console.log(commonArea);
    this.navCtrl.push(ServiceCenterAptPage);
    // this.navCtrl.push(NewServiceRequestPage);
  }  

  getAllNeighbours() {
    this.firebase.getNeighbours().then((userData) => {
      this.users = userData;
      // console.log(this.users);
    }, error => {
      console.error(error);
    });
  }

  goToNeighbour(neighbour) {
    this.app.getRootNav().push(MessagePage, { 'neighbour': neighbour });
    // this.navCtrl.push();
  }
  
  // serviceReqDetail(serviceRequest){
  //   this.navCtrl.push(ServiceReqDetailsPage, {'serviceRequest':serviceRequest});
  // }
  // getAllReq() {
    

  //   this.firebase.getAllSupportReq().then((data) => {
  //     this.allRequests = data;
  //     this.inProgressReqs = [];
  //     this.completedReqs = [];
  //     for (let i = 0; i < this.allRequests.length; i++) {
  //       if (this.allRequests[i].status == "inProgress") {
  //         this.inProgressReqs.push(this.allRequests[i]);
  //       }
  //       else if (this.allRequests[i].status == "completed") {
  //         this.completedReqs.push(this.allRequests[i]);
  //       }
        
  //     }
  //   });
  // }

  // fullCompletedReqArray(){
  //   this.completedArrayLength = this.completedReqs.length;
  //   this.allCompletedReqsShown = true;
  // }
  // fullInProgressReqArray() {
  //   this.inProgArrayLength = this.inProgressReqs.length;
  //   this.allInProgressReqsShown = true;
  // }

  // getAllServiceReq() {
  //   this.loading.present();
  //   this.firebase.loadAllAdminSupportReqs().then((data) => {
  //     this.allRequests = data;
  //     console.log('all service reqs',this.allRequests);
  //     this.loading.dismiss();
  //     this.filterReq();
  //   }, (error) => {
  //     this.noServReq = true;
  //     this.loading.dismiss();
  //   });
  // }
  // filterReq() {
  //   this.inProgressReqs = [];
  //   this.completedReqs = [];

  //   for (let i = 0; i < this.allRequests.length; i++) {
  //     if (this.allRequests[i].status == "inProgress") {
  //       this.inProgressReqs.push(this.allRequests[i]);
  //     }
  //     else if (this.allRequests[i].status == "completed") {
  //       this.completedReqs.push(this.allRequests[i]);
  //     }

  //   }
  //   console.log(this.inProgressReqs);
  // }
  // fullCompletedReqArrayAdmin() {
  //   this.completedArrayLength = this.completedReqs.length;
  //   this.allCompletedReqsShown = true;
  // }
  // fullInProgressReqArrayAdmin() {
  //   this.inProgArrayLength = this.inProgressReqs.length;
  //   this.allInProgressReqsShown = true;
  // }

}
