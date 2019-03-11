import { Component, NgZone, ViewChild, ElementRef, } from '@angular/core';
import { NavController, NavParams, Content, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';

/**
 * Generated class for the ServiceReqDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-service-req-details',
  templateUrl: 'service-req-details.html',
})
export class ServiceReqDetailsPage {
  @ViewChild('commentInput') myInput: ElementRef;
  @ViewChild('content') content: Content;
  serviceReqDetails: any;
  allNotes: any = [];
  reqhasNotes: boolean = false;
  userType: any;
  notes: any;
  notesRow: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public events: Events, public zone: NgZone, public globals: GlobalsProvider) {
    this.serviceReqDetails = this.navParams.get('serviceRequest');
    console.log(this.serviceReqDetails);  
    // newNoteAdded
    this.getAllNotes();
    this.userType = this.globals.userData.userType;

    this.events.subscribe('noteAdded', () => {
      this.zone.run(() => {
        this.getAllNotes();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceReqDetailsPage');
  }
  back() {
    this.navCtrl.pop();
  }
  getAllNotes() {
    this.firebase.getAllServiceReqNotes(this.serviceReqDetails.id).then((data) => {
      if (data) {
        this.allNotes = data;
      }
     
      // console.log('all notes',this.allNotes);
    }).catch((err) => {
      console.log(err);
    });
  }

  completeSupportReq() {
    this.firebase.completeSupportReq(this.serviceReqDetails.id).then((data) => {
      this.serviceReqDetails.status = 'completed';
    });
  }
  addNotes() {
    this.firebase.addNotesToServiceReq(this.serviceReqDetails, this.notes).then((data) => {
      this.notes = '';
      this.myInput.nativeElement.style.height = '20px';
    });
  }

  resize() {
    console.log(this.myInput.nativeElement.style.height);
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';

  }

}
