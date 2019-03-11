import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';

/**
 * Generated class for the HouseRuleDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-house-rule-details',
  templateUrl: 'house-rule-details.html',
})
export class HouseRuleDetailsPage {
  details: any;
  pdfList: any = [];
  pdfUrl = '';
  storageDirectory: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer, public iab: InAppBrowser, private transfer: FileTransfer, private file: File, public platform: Platform, private document: DocumentViewer, private fileOpener: FileOpener) {
    this.details = this.navParams.get('detail');
    console.log(this.pdfList)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseRuleDetailsPage');
  }
  back() {
    this.navCtrl.pop();
  }
  openPdf(pdfUrl) {
    // window.open(pdfUrl, '_blank', 'EnableViewPortScale=yes');
    if (this.platform.is('ios')) {
      const options: InAppBrowserOptions = {
        toolbar: 'yes',
        transitionstyle: 'coververtical',
        hidenavigationbuttons: 'yes',
        location: 'yes',
        presentationstyle: 'pagesheet',
        enableViewportScale: 'yes',
        zoom: 'yes'
      }
      const browser = this.iab.create(pdfUrl, '_blank', options);
    }
    else if (this.platform.is('android')) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const url = pdfUrl;
      fileTransfer.download(url, this.storageDirectory + 'file.pdf', true, { 'Access-Control-Allow-Origin': '*' }).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        this.fileOpener.open(entry.toURL(), 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch((error) => {
            this.viewDocument(entry.toURL());
          });
      }, (error) => {
        // handle error
      });
    }
    else {
      window.open(pdfUrl, '_system', 'EnableViewPortScale=yes');
    }
  }
  viewDocument(location) {
    const options: DocumentViewerOptions = {
      title: 'Building Info'
    }
    this.document.viewDocument(location, 'application/pdf', options);
  }

}
