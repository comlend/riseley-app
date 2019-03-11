import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BuildingInfoDetailsPage } from '../building-info-details/building-info-details';
import { ContactListPage } from '../contact-list/contact-list';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as _ from 'lodash';
@Component({
  selector: 'page-building-info',
  templateUrl: 'building-info.html',
})
export class BuildingInfoPage {
  buildingInfos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, private iab: InAppBrowser) {

    this.firebase.getBuildingInfo().then((data)=>{
      this.buildingInfos = data;
      this.buildingInfos = _.orderBy(this.buildingInfos, ['name'], ['asc']); 
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoPage');
  }
  back(){
    this.navCtrl.pop();
  }
  details(info){
    // if (info.pdf) {
    //   let pdfUrl = info.pdf[0].pdf;
    //   this.openPdf(pdfUrl);
    // } 
    if (info.pdf && info.text) {
      this.navCtrl.push(BuildingInfoDetailsPage, { detail: info });
    }
    else {
      this.navCtrl.push(BuildingInfoDetailsPage, { detail: info });
    }
  }

  openPdf(pdfUrl) {
    const browser = this.iab.create(pdfUrl, '', 'transitionstyle=crossdissolve,location=no');


    // browser.on('loadstop').subscribe(event => {
    // });

    // browser.close();
  }

}
