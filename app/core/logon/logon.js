import {Page, NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
//import {FormBuilder, Validators, FORM_DIRECTIVES} from 'angular2/core'; import {UserServices} from '../../users/user.services';


//import {FormBuilder, Validators, FORM_DIRECTIVES} from 'angular2/angular2';

import {UserServices} from '../../users/user.services';

@Page({
  templateUrl:  'build/core/logon/logon.html'
})

export class LogonPage {
  static get parameters() {
      return [[UserServices], [NavController]];
  }



  constructor(_user, _nav) {
    this.nav = _nav;
    this.user = _user;
    this.properties = '';

  }

  //
  // ngOnInit() {
  //       this.propertyService.findAll().subscribe(
  //           data => this.properties = data
  //       );
  //   }
  //
  doSubmit(event) {
    //let self = this;
    //alert('aa');
    let value;

    this.user.authenticate({username:'teste', password:'fender77'})
      .subscribe(
        //response => console.log(response),
        data => value = data,
        err => alert(err),
        () =>   this.nav.push(TabsPage)

      );

    //console.log('fim', this.user.profile);


  }
}
