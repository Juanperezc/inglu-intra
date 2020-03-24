import { Component } from '@angular/core';
import { UserStorage } from './services/util/UserStorage.service';
import { UserService } from './services/http/UserService.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent { 

  constructor(private userService: UserService){
  this.updateMe();
  }

  async updateMe(){
    try {
      const getAuth = await UserStorage.isAuthenticated();
      if (getAuth){
        const dataMe: any = await this.userService.me();
        console.log(dataMe);
        if (dataMe.data){
          await UserStorage.setUser(dataMe.data);
        }
      }
    } catch (error) {
      console.error("error", error)
    }
  }
}
