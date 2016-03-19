import {App, IonicApp, IonicPlatform} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {CoreServices} from '../core/core.services';
import {User} from '../core/datatypes/user.type';
import {CordovaOauth, Spotify} from 'ng2-cordova-oauth/core';

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

    //connect to spotify user account and save token to the server
    connectSpotify(){

      let dialogOptions = ['user-read-email', 'user-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private'];
      let url = this.core.SERVER_URL().API_USERS + '/' + this.profile.id + this.core.SERVER_URL().API_SPOTIFY_CONNECT;

    //    this.cordovaOauth = new CordovaOauth(new Spotify({clientId: this.core.SERVER_URL().API_SPOTIFY_CLIENT_ID,response_type:'code',appScope: [""],show_dialog: dialogOptions }));
    //        this.cordovaOauth.login().then((success) => {
              //save token to server
              //let body = JSON.stringify({spotifyprofile:success});
              let body = JSON.stringify({spotifyprofile:'token:asdasdasdasdasasd'});
              console.log('aqui', body);
              return this.core.httpPost(url, body)
                  .map(res => data);

                //  .map(res => alert(res))
                 //  .map(data => this.setSession(data))
                 //  .map(this.profile = data)
              //    .catch(this.handleError);

//               //send code to server to create token and save to user profile
//   $http.post(SERVER.API_URL  + SERVER.API_USERS + '/' + o.id + SERVER.API_SPOTIFY_CONNECT, {spotifyprofile:result } )
//       .success(function(response){
//       o.setSessionAPI(response);
//       Spotify.setAuthToken(o.spotifyToken);
//
//       alert('successfuly connected to spotify ');
//   });
//
//  // $scope.updateInfo();
// }, function(error) {
//     alert("Could not connect to spotify" + error);
// });


              //  alert('resultado' +  JSON.stringify(success));
      ////      }, (error) => {
          //      alert('Could not connect to Spotify account.' +  error);
      //      });
    }


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
		this.token= false;
		this.username=false;
		this.server= false;
  };


  // // set session data
  // setSessionAPI (user) {
  //
  //
  //   if (user.success){
  //
  //     if (user.token) this.token = user.token;
  //     if (user.token) this.token = user.token;
  //     if (user.username) this.username = user.username;
  //
  //     this.core.setStoreObject('user', user);
  //
  //     this.core.setServerUrlAPI(user.server);
  //     this.core.setHttpAccessToken(this.token);
  //     return true;
  //   }
  //
  //
  //   return false;
  //
	// };

}
