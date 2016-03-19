import {Page} from 'ionic-angular';
import {UserServices} from '../../users/user.services';



@Page({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {

static get parameters() {
    return [UserServices];
}


constructor(_user) {
  this.user = _user;
}

connectSpotify(){
  this.user.connectSpotify();
}

//
// ngOnInit() {
//       this.propertyService.findAll().subscribe(
//           data => this.properties = data
//       );
//   }

}
