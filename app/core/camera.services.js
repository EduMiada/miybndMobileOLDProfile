import {App, IonicApp, IonicPlatform} from 'ionic-angular';;
import {Camera} from 'ionic-native';
import {Injectable, Inject, bind} from 'angular2/core';


@Injectable()
export class CameraServices {


  static get parameters() {
      return [[Camera]];
  };

  constructor(camera){
      this.camera = camera;
  }

  getPicture(options){
    if (!options){
        options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };
    }

    return Camera.getPicture(options)
      .then((imageData) => {
        let base64Image = "data:image/jpeg;base64," + imageData;
      },
      (err) => {
      });

  }
}
