import {App, IonicApp, IonicPlatform} from 'ionic-angular';;
import {Injectable, Inject, bind} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class CoreServices {


    static get parameters() {
        return [[Http]];
    };




    constructor(http){
      //  this.app = app;
        this.http = http;
        this.token = '';
        this.server = '';


    }


    SERVER_URL() {
      let url = {
         API_URL:'http://miada.com.br:3000/v1/api',
         //API_URL:'http://localhost:3000/v1/api',
         API_AUTH_FACEBOOK :  '/auth/facebook',
         API_FACEBOOK_CLIENT_ID: '162506894117176',
         API_SPOTIFY_CLIENT_ID: '5063d7fc578d4b928e96e050790860c9',
         API_SPOTIFY_CONNECT: '/connectspotify',
         API_OAUTH_CALLBACK: '/localhost/callback',
         API_AUTHENTICATE :  '/authenticate',
         API_SUGGESTIONS :  '/suggestions' ,
         API_SONGS :  '/songs',
         API_USERS: '/users',
         API_USERS_ACCOUNTS: '/accounts',
         API_USER_PICTURE: '/picture',
         API_USER_PROFILE: '/profile',
         API_FEEDS: '/feeds',
         API_FEED_COMMENT: '/comments',
         API_CURRENT_BAND : '/currentband',
         API_SEARCH_NEW_TRACK: '/searchtrack',
         API_ADD_MUSIXMATCH_TRACK:'/addmusicxmatch'
       };
     return url;
    }


    //set the api token to be used on http call
    setHttpAccessToken(token){
        this.token = token;
    }

    setServerUrlAPI(url){
        this.server = url;
    }

    //return http get response
    httpGet(url){

        let serverUrl =  this.SERVER_URL().API_URL;
        let headers = new Headers();

        headers.append('Content-Type' , 'application/json');
        headers.append('x-access-token', this.token);

        return  this.http.get(serverUrl + url, {headers: headers});
    }

    //return http post response
    httpPost(url, data){
        let serverUrl =  this.SERVER_URL().API_URL;
        let headers = new Headers();

        headers.append('Content-Type' , 'application/json');
        headers.append('x-access-token', this.token);

        if(data){
            return  this.http.post(serverUrl + url, data, {headers:headers});
        }else{
            return  this.http.post(serverUrl + url, {headers:headers});
        }
    }



    //Manage Storage to Session
    setStorage(key, value){
        localStorage[key] = value;
    }
    getStorage(key, defaultValue) {
        return localStorage[key] || defaultValue;
    }
    setStoreObject(key, value) {
        localStorage[key] = JSON.stringify(value);
    }
    getStoreObject(key) {
        return JSON.parse(localStorage[key] || '{}');
    }


}
