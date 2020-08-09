import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/user/user.service';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'Sac do Bem';
  user$: Observable<UserProfile>;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.user$ = userService.getUser();
   }

  ngOnInit(): void {
  }

  logout(){
    this.router.navigate(['']);
    this.userService.logout();
  }




}
