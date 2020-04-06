import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserStorage } from './UserStorage.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router) {}
  async canActivate(): Promise<boolean> {
    const isAuthenticated = await UserStorage.isAuthenticated();
  /*   console.log('guard', isAuthenticated); */
    if (isAuthenticated) {
      return true;
    }else{
      this.router.navigateByUrl('/public/sign-in');
      return false;
    }
   
  }
}