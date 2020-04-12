import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../../services/http/http.service';
import { UserService } from '../../../services/http/UserService.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserStorage } from '../../../services/util/UserStorage.service';

@Component({
  selector: 'actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  user : any;
  notifications: any[];
  messages: any[];
  files: any[];
  closeDropdown: EventEmitter<boolean>;
  @Input() layout: string;

  constructor(
    private httpSv: HttpService,
    private router: Router,
    private userService: UserService,
    private ngxSpinner: NgxSpinnerService
  ) {
    this.notifications = [];
    this.messages = [];
    this.files = [];
    this.closeDropdown = new EventEmitter<boolean>();
    this.layout = 'vertical';
  }

  async ngOnInit() {
    this.user = await UserStorage.getUser();
    this.getData('assets/data/navbar-notifications.json', 'notifications');
    this.getData('assets/data/navbar-messages.json', 'messages');
    this.getData('assets/data/navbar-files.json', 'files');
  }
  async logout(){
    event.preventDefault();
    this.onCloseDropdown();
    try {
      this.ngxSpinner.show();
      const logoutData: any = await this.userService.logout();
      console.log("logoutData",logoutData)
      await UserStorage.clear();
      this.ngxSpinner.hide();
      if (logoutData){
        this.router.navigateByUrl("/public/sign-in");
      }
    } catch (error) {
      console.error('error', error);
      this.ngxSpinner.hide();
    }
  }
  getData(url: string, dataName: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this[dataName] = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  onCloseDropdown() {
    this.closeDropdown.emit(true);
  }

  goTo(event: Event, link: string, layout: string = '') {
    event.preventDefault();

    this.onCloseDropdown();

    setTimeout(() => {
      this.router.navigate([layout ? layout : this.layout, link]);
    });
  }
}
