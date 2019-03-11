import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { NewServiceRequestPage } from '../new-service-request/new-service-request';
import { ServiceReqDetailsPage } from '../service-req-details/service-req-details';

/**
 * Generated class for the ServiceCenter2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-service-center2',
  templateUrl: 'service-center2.html',
})
export class ServiceCenter2Page {
  isCommon: any;
  allRequests: any;
  inProgressReqs: any = [];
  completedReqs: any = [];
  inProgArrayLength: any = 3;
  completedArrayLength: any = 3;
  allInProgressReqsShown: boolean = false;
  allCompletedReqsShown: boolean = false;
  loading: any;
  userType: any;
  noServReq: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public events: Events, public zone: NgZone, public loadingCtrl: LoadingController, public globals: GlobalsProvider) {
   
    this.loading = this.loadingCtrl.create({ content: 'Loading all service requests..' });
    this.userType = this.globals.userData.userType;
    // console.log('this user is - ', this.userType)

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ServiceCenter2Page');
    this.userType = this.globals.userData.userType;

    if (this.userType != 'admin') {
      this.getAllReq();
    }
    else if (this.userType == 'admin') {
      this.getAllServiceReq();
    }
  }

  ionViewWillEnter(){
    // this.userType = this.globals.userData.userType;

    if (this.userType != 'admin') {
      this.getAllReq();
      // this will fetch service requests for building manager
    }
    else if (this.userType == 'admin') {
      this.getAllServiceReq();
    }
  }
  
  back() {
    this.navCtrl.pop();
  }

  newRequest() {
    // this.navCtrl.push(ServiceCenter2Page);
    this.navCtrl.push(NewServiceRequestPage);
  }
  serviceReqDetail(serviceRequest) {
    this.navCtrl.push(ServiceReqDetailsPage, { 'serviceRequest': serviceRequest });
  }
  getAllReq() {

    this.loading.present();
    this.firebase.getAllSupportReq().then((data) => {
      console.log(data);
      if (data != '') {
        
      
        this.allRequests = data;
        this.inProgressReqs = [];
        this.completedReqs = [];
        for (let i = 0; i < this.allRequests.length; i++) {
          if (this.allRequests[i].status == "inProgress") {
            this.inProgressReqs.push(this.allRequests[i]);
            this.loading.dismiss();
          }
          else if (this.allRequests[i].status == "completed") {
            this.completedReqs.push(this.allRequests[i]);
            this.loading.dismiss();
          }
        }
      }
      else{
        this.noServReq = true;
        this.loading.dismiss();
      }
      // this.completedReqs.reverse();
      // console.log(this.allRequests);
    }, (error) => {
      this.noServReq = true;
      this.loading.dismiss();
    });
    // this.inProgressReqs.revese();
  }

  fullCompletedReqArray() {
    this.completedArrayLength = this.completedReqs.length;
    this.allCompletedReqsShown = true;
  }
  fullInProgressReqArray() {
    this.inProgArrayLength = this.inProgressReqs.length;
    this.allInProgressReqsShown = true;
  }

  // for building manager 
  getAllServiceReq() {
    this.loading.present();
    this.firebase.loadAllAdminSupportReqs().then((data) => {
      if (data != '') {
        this.allRequests = data;
        console.log('all service reqs', this.allRequests);
        this.loading.dismiss();
        this.filterReq();
      }
      else{
        this.noServReq = true;
        this.loading.dismiss();
      }
    }, (error) => {
      this.noServReq = true;
      this.loading.dismiss();
    });
  }
  filterReq() {
    this.inProgressReqs = [];
    this.completedReqs = [];

    for (let i = 0; i < this.allRequests.length; i++) {
      if (this.allRequests[i].status == "inProgress") {
        this.inProgressReqs.push(this.allRequests[i]);
      }
      else if (this.allRequests[i].status == "completed") {
        this.completedReqs.push(this.allRequests[i]);
      }

    }
    console.log(this.inProgressReqs);
  }
  // fullCompletedReqArrayAdmin() {
  //   this.completedArrayLength = this.completedReqs.length;
  //   this.allCompletedReqsShown = true;
  // }
  // fullInProgressReqArrayAdmin() {
  //   this.inProgArrayLength = this.inProgressReqs.length;
  //   this.allInProgressReqsShown = true;
  // }

}
