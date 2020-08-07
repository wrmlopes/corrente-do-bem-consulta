import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('in guard login');
    console.log('next: ', next);
    console.log('state: ', state);

    if (this.userService.isLogged()) {
      // this.router.navigate(['consulta', this.userService.getUserName()])
      // this.router.navigate([state.url])
      return true;
    } else {
      this.router.navigate(['signin', {rotaOrg: state.url}]);
      console.log('retornou login ?');
      return this.userService.isLogged();
    }
    return true;
  }

}

    // constructor(
    //     private userService: UserService,
    //     private router: Router) {}

