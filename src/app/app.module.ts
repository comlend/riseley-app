import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';

import { IonicStorageModule } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { SplashPage } from '../pages/splash/splash';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterBusinessPage } from '../pages/register-business/register-business';
import { RegisterRentingPage } from '../pages/register-renting/register-renting';
import { RegisterOwnerPage } from '../pages/register-owner/register-owner';
import { FbprofilePage } from '../pages/fbprofile/fbprofile';
import { MessagePage } from '../pages/message/message';
import { MessagesListPage } from '../pages/messages-list/messages-list';
import { NeighboursPage } from '../pages/neighbours/neighbours';
import { NewsPage } from '../pages/news/news';
import { BusinessDetailsPage } from '../pages/business-details/business-details';
import { AddNewsPage } from '../pages/add-news/add-news';
import { NewsDetailsPage } from '../pages/news-details/news-details';
import { MorePage } from '../pages/more/more';
import { BuildingInfoPage } from '../pages/building-info/building-info';
import { ServiceCenterPage } from '../pages/service-center/service-center';
import { LiveLocalPage } from '../pages/live-local/live-local';
import { SettingsPage } from '../pages/settings/settings';
import { AddLocalPage } from '../pages/add-local/add-local';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FirebaseProvider } from '../providers/firebase/firebase';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook'
import { GlobalsProvider } from '../providers/globals/globals';
import { FCM } from '@ionic-native/fcm';
import { HttpClientModule } from '@angular/common/http';
import { EventDispatcherProvider } from '../providers/event-dispatcher/event-dispatcher';

import { PipesModule } from '../pipes/pipes.module';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { TncPage } from '../pages/tnc/tnc';
import { BuildingInfoDetailsPage } from '../pages/building-info-details/building-info-details';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { BlockedUsersListPage } from '../pages/blocked-users-list/blocked-users-list';
import { AddBlockedUsersPage } from '../pages/add-blocked-users/add-blocked-users';
import { NewServiceRequestPage } from '../pages/new-service-request/new-service-request';
import { ServiceReqDetailsPage } from '../pages/service-req-details/service-req-details';
import { UtilitiesProvider } from '../providers/utilities/utilities';

import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy'; 
import { Keyboard } from '@ionic-native/keyboard';
import { Badge } from '@ionic-native/badge';

import * as firebase from 'firebase';
import { CreateEventPage } from '../pages/create-event/create-event';
import { RegisterBuildingManagerPage } from '../pages/register-building-manager/register-building-manager';
import { FirstPage } from '../pages/first/first';
import { ContactListPage } from '../pages/contact-list/contact-list';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ServiceCenter2Page } from '../pages/service-center2/service-center2';
import { HouseRulePage } from '../pages/house-rule/house-rule';
import { HouseRuleDetailsPage } from '../pages/house-rule-details/house-rule-details';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { ServiceCenterAptPage } from '../pages/service-center-apt/service-center-apt';
import { NewServiceReqAptPage } from '../pages/new-service-req-apt/new-service-req-apt';
import { ReportPostPage } from '../pages/report-post/report-post';

var config = {
  apiKey: "AIzaSyA4sBMDqCbQPeaCQ5L3xItosjDeW1Q4t28",
  authDomain: "riseley-st.firebaseapp.com",
  databaseURL: "https://riseley-st.firebaseio.com",
  projectId: "riseley-st",
  storageBucket: "riseley-st.appspot.com",
  messagingSenderId: "257675727271"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SplashPage,
    SignupPage,
    LoginPage,
    RegisterPage,
    RegisterBusinessPage,
    RegisterRentingPage,
    RegisterOwnerPage,
    FbprofilePage,
    MessagePage,
    NeighboursPage,
    NewsPage,
    MessagesListPage,
    BusinessDetailsPage,
    AddNewsPage,
    NewsDetailsPage,
    MorePage,
    BuildingInfoPage,
    ServiceCenterPage,
    LiveLocalPage,
    SettingsPage,
    AddLocalPage,
    EditProfilePage,
    TncPage,
    BuildingInfoDetailsPage,
    ProfilePage,
    NotificationsPage,
    BlockedUsersListPage,
    AddBlockedUsersPage,
    NewServiceRequestPage,
    ServiceReqDetailsPage,
    PrivacyPolicyPage,
    CreateEventPage,
    RegisterBuildingManagerPage,
    FirstPage,
    ContactListPage,
    ServiceCenter2Page,
    HouseRulePage,
    HouseRuleDetailsPage,
    ServiceCenterAptPage,
    NewServiceReqAptPage,
    ReportPostPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { mode: 'ios', autoFocusAssist: true, tabsHideOnSubPages: true }),
    HttpModule,
    IonicStorageModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SplashPage,
    SignupPage,
    LoginPage,
    RegisterPage,
    RegisterBusinessPage,
    RegisterRentingPage,
    RegisterOwnerPage,
    FbprofilePage,
    MessagePage,
    NeighboursPage,
    NewsPage,
    MessagesListPage,
    BusinessDetailsPage,
    AddNewsPage,
    NewsDetailsPage,
    MorePage,
    BuildingInfoPage,
    ServiceCenterPage,
    LiveLocalPage,
    SettingsPage,
    AddLocalPage,
    EditProfilePage,
    TncPage,
    BuildingInfoDetailsPage,
    NotificationsPage,
    ProfilePage,
    BlockedUsersListPage,
    AddBlockedUsersPage,
    NewServiceRequestPage,
    ServiceReqDetailsPage,
    PrivacyPolicyPage,
    CreateEventPage,
    RegisterBuildingManagerPage,
    FirstPage,
    ContactListPage,
    ServiceCenter2Page,
    HouseRulePage,
    HouseRuleDetailsPage,
    ServiceCenterAptPage,
    NewServiceReqAptPage,
    ReportPostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    FirebaseProvider,
    Facebook,
    GlobalsProvider,
    FCM,
    EventDispatcherProvider,
    UtilitiesProvider,
    Keyboard,
    Badge,
    InAppBrowser,
    FileTransfer,
    File,
    DocumentViewer,
    FileOpener
  ]
})
export class AppModule {}
