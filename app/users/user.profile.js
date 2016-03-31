import {Page, NavController, Alert, ActionSheet} from 'ionic-angular';
import {UserServices} from '../users/user.services';
//import {CameraServices} from '../core/camera.services';
import {Camera} from 'ionic-native';

@Page({
  templateUrl: 'build/users/user.profile.html'
})
export class UserProfile {

  static get parameters() {
      return [UserServices, NavController];
  }

  constructor(_user, _nav) {
    this.user = _user;
    this.nav = _nav;

    this.isConnected = {spotify:false,facebook:false};
    this.instrumentList = [{code:'GUITAR', name:'Guitar'}, {code:'BASS',name:'Bass'}, {code:'VOCAL',name:'Vocal'}, {code:'DRUM',name:'Drum'}];
    this.channelList = [{code:'YOUTUBE', name:'YouTube'}, {code:'SUNDCLOUD', name: 'SoundCloud'}];
    this.experienceList = [{code:'BEGINNER', name:'Beginner'}, {code:'INTEMEDIATE', name:'Intermediate'}, {code:'ADVANCED', name:'Advanced'}, {code:'NINJA', name:'Ninja'}]
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile(){
    let result = [];
    this.user.loadProfile()
      .subscribe(
        data => {result = data;  if(this.user.profile.spotifyToken) this.isConnected.spotify = true} ,
        err => console.log('Erro', err),
        () => console.log('fim')
      );
  }

  takePicture(){
    let actionSheet = ActionSheet.create({
      title: 'Profile Picture',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Galery',
          handler: () => {
            this.user.takePicture(0);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.user.takePicture(1);
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.nav.present(actionSheet);



  }


  connectSpotify(){

    //if not already connected and selected the on option / open the oauth connection
    if (this.isConnected.spotify && !this.user.profile.spotifyToken){
      this.user.connectSpotify()
      .subscribe(
        data => console.log(data),
        err => console.log('Erro', err),
        () =>   console.log('profile loaded', this.user.profile )
      );
    }

    //if already connected open dialog to confirm disconnection
    if (!this.isConnected.spotify && this.user.profile.spotifyToken != ''){
      let confirm = Alert.create({
          title: 'Disconnect Spotify',
          message: 'Are you sure you wanto to disconnect Spotify account?',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
                //change de flag to true again
                this.isConnected.spotify =true;
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.disconnectSpotify();
              }
            }
          ]
        });
        this.nav.present(confirm);
    }
    //return true;
  }

  disconnectSpotify(){

    //if not already connected and selected the on option / open the oauth connection
    //if already connected open dialog to confirm disconnection
    if (!this.isConnected.spotify && this.user.profile.spotifyToken != ''){
      this.user.disconnectSpotify()
        .subscribe(
          data => {result = data;  if(this.user.profile.spotifyToken) this.isConnected.spotify = true} ,
          err => console.log('Erro', err),
          () =>   console.log('profile loaded', this.user.profile )
        );
    }
    //return true;
  }

  updateProfile (){
    let result = [];
    this.user.updateProfile(this.user.profile.musicProfile,false, false)
    .subscribe(
      data => result = data,
      err => console.log('Erro', err),
      () =>   console.log('profile saved' )
    );
  };


  presentPrompt() {
  let alert = Alert.create({
  //  title: 'Say something about you',
    inputs: [
      {
        name: 'about',
        placeholder: 'say something about you',
        value: this.user.profile.musicProfile.about
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          this.user.profile.musicProfile.about = data.about;
          this.updateProfile();

          //if (User.isValid(data.username, data.password)) {
            // logged in!
          //} else {
            // invalid login
        //    return false;
        //  }
        }
      }
    ]
  });
  this.nav.present(alert);
}

}
