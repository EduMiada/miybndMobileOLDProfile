import {App, IonicApp, IonicPlatform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {CoreServices} from '../core/core.services';
import {User} from '../core/datatypes/user.type';
import {CordovaOauth, Spotify} from 'ng2-cordova-oauth/core';
import {Camera} from 'ionic-native';

@Injectable()
export class UserServices {
    static get parameters() {
        return [[Http], [CoreServices]];
    }

    constructor(http,core) {
        this.core = core;
        this.http = http;

        this.profile = {
          id: false,
          token: false,
          picture:false,
          pictureSmall:false,
          username: false,
          displayName: false,
          bandId:false,
          bandName:false,
          deviceId:false,
          bands: [],
          fb:false,
          facebookToken:false,
          spotifyToken:false,
          musicProfile: {about:'', instrument:'', experience:'', styles:[], influencies:[]},
          contact: {bio:'', city:'', area:'', zip:''},
          channels: [{channel:'', name:'', url:''}]
        };

    }


    // check if there's a user session present
    isConnected () {

        console.log('start');
        // if this session is already initialized in the service
        if (this.profile.token) {

            console.log('User is has a valid token, is connected');
            return true;
        }
        else {

            // check if there's a session in localstorage from previous use.
            // if it is, pull into our service
            var user = this.core.getStoreObject('user');
            if (user.token) this.setSession(user);

            if (this.profile.token) {
                console.log('User has connected befere has a valid token', this.profile);
                return true;
            }
            else {
                // no user info in localstorage, reject
                console.log('User DONT have a valid token');
                return false;
            }
        } //end if
    }; //end func


    // attempt login or signup
    authenticate (credentials) {
      let url = this.core.SERVER_URL().API_AUTHENTICATE;
      let body = JSON.stringify(credentials);

      return this.core.httpPost(url, body)
          .map(res => this.setSession(res.json()))
        //  .map(data => this.setSession(data))
          //.map(this.profile = data)
          .catch(this.handleError);
    };

    //load user profile to update maybe move to auth code -- change neeed to rest api
 	  loadProfile () {
      let url = this.core.SERVER_URL().API_USERS + '/' + this.profile.id + this.core.SERVER_URL().API_USER_PROFILE;

      return this.core.httpGet(url)
        .map(res => this.setProfile(res.json()))
        .catch(this.handleError);
     };





     //update profile
     updateProfile (profile, contact, channels) {
       let url = this.core.SERVER_URL().API_USERS + '/' + this.profile.id + this.core.SERVER_URL().API_USER_PROFILE;

       let body = JSON.stringify({profile:profile, contact:contact, channels:channels});

       console.log(body);

       return this.core.httpPost(url, body)
           .map(res => res.json())
          //  .map(data => this.setSession(data))
          //  .map(this.profile = data)
           .catch(this.handleError);
   	};

    // attempt login or signup
    setProfilePicture (picture) {
      let url = this.core.SERVER_URL().API_USERS + '/' + this.profile.id + this.core.SERVER_URL().API_USER_PICTURE;
      let body = JSON.stringify({picture:picture});

      return this.core.httpPost(url, body)
          .map(res => res.json())
          .catch(this.handleError);
  	};



    //connect to spotify user account and save token to the server
    connectSpotify(){
      let url = this.core.SERVER_URL().API_USERS + '/' + this.profile.id + this.core.SERVER_URL().API_SPOTIFY_CONNECT;
      let dialogOptions = ['user-read-email', 'user-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private'];

        this.cordovaOauth = new CordovaOauth(new Spotify({clientId: this.core.SERVER_URL().API_SPOTIFY_CLIENT_ID,response_type:'code',appScope: [""],show_dialog: dialogOptions }));
            this.cordovaOauth.login().then((success) => {

              let user = this.core.getStoreObject('user');

              let body =  JSON.stringify({spotifyprofile:success});
              return this.core.httpPost(url, body)
                  .map(res => res.json())
                  .map(data => user.data.additionalProvidersData = data.additionalProvidersData)
                  .map(data => this.setProfile(res.json()))
                  .catch(this.handleError);

            }, (error) => {
                alert('Could not connect to Spotify account.' +  error);
            });
    }


    disconnectSpotify(){
      let url = this.core.SERVER_URL().API_USERS + '/' + this.profile.id + this.core.SERVER_URL().API_USERS_ACCOUNTS;
      let user = this.core.getStoreObject('user');

      return this.core.httpDelete(url, JSON.stringify({provider:'spotify'}))
        .map(res => console.log(res))
        .catch(this.handleError);
      };





  //hande http observer error
  handleError(error) {
          console.error('erro server', error);
          // return Observable.throw(error.json().error || 'Server error');
        return Observable.throw( 'Server error');
  };

  setProfile (user) {
    // //music profile
    if (user.data.profile) this.profile.musicProfile = user.data.profile;
    if (!user.data.profile.styles) this.profile.musicProfile.styles = [];
    if (!user.data.profile.influencies) this.profile.musicProfile.influencies = [];
    if (user.data.profile) this.profile.contact = user.data.contact;
    if (user.data.profile) this.profile.channels = user.data.channels;

  };


    setSession (user) {

    	if (user.data._id) this.profile.id = user.data._id;
  		if (user.token) this.profile.token = user.token;
  		if (user.data.username) this.profile.username = user.data.username;
  		if (user.data.displayName) this.profile.displayName = user.data.displayName;
  		if (user.data.picture) this.profile.picture = user.data.picture;
    	if (user.data.selectedBand) this.profile.bandId = user.data.selectedBand._id;
  		if (user.data.selectedBand) this.profile.bandName = user.data.selectedBand.name;
  		if (user.data.bands) this.profile.bands = user.data.bands;

      try {
           if (user.data.providerData.accessToken) this.profile.facebookToken = user.data.providerData.accessToken;
      } catch (error) {
          this.profile.facebookToken = false;
      }

      try {
         if (user.data.additionalProvidersData['spotify'].accessToken) this.profile.spotifyToken = user.data.additionalProvidersData['spotify'].accessToken;
      } catch (error) {
          this.profile.spotifyToken = false;
      }


  		// Set the token as header for your requests!
      this.core.setHttpAccessToken (this.profile.token);

      // set data in localstorage object
      this.core.setStoreObject('user', user);

  		//console.log('setsession new user', user);
  	};


  //Authenticate user
  destroySession() {
    this.core.setStoreObject('user', {});
    this.core.setHttpAccessToken(undefined);
		this.profile.token = false;
		this.profile.username = false;
  };

  takePicture(source){

    let options = {
        quality: 50,
        destinationType:0, // Camera.DestinationType.DATA_URL,
        sourceType: source, //Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: 0, //Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false,
        correctOrientation:true
    };

    let user = this.core.getStoreObject('user');

    return Camera.getPicture(options)
      .then((imageData) => {
        let base64Image = "data:image/jpeg;base64," + imageData;
        this.setProfilePicture(base64Image)
        .subscribe(
          res => {  this.profile.picture = base64Image,
                    user.data.picture = base64Image,
                    this.core.setStoreObject('user', user);
                },
          err => err
        );

      },(err) => {
        return err;
      });

  }

}
