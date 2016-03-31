import {App, IonicApp, Platform}  from 'ionic-angular';
import {CoreServices} from './core/core.services';
import {CameraServices} from './core/camera.services';
import {UserServices} from './users/user.services';
import {TabsPage} from  './core/tabs/tabs';
import {LogonPage} from './core/logon/logon';
import {UserProfile} from './users/user.profile';





@App({
  //template: '<ion-nav [root]="rootPage"></ion-nav>',
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [CoreServices, UserServices, CameraServices]

})
export class MyApp {
  static get parameters() {
    return [[IonicApp],[Platform], [UserServices]];
  }

  constructor(app, platform, user) {
    let self = this;

    this.app = app;
    this.user = user;
  //  this.rootPage = TabsPage;


    let promise = new Promise(resolve => {
      resolve(user.isConnected());
    });

    promise.then(function(connected){
      console.log('user connected',connected);
      if (!connected){
        self.rootPage = LogonPage;
      }else{
        self.rootPage = TabsPage;
      }
    });


    platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }

  openPage(page) {
    let nav = this.app.getComponent('nav');
    console.log('aqui');
    //this.nav.push(TabsPage)
    nav.push(UserProfile);
  }

  logout() {
    let nav = this.app.getComponent('nav');
    this.user.destroySession();
    nav.push(LogonPage);
  };
}
