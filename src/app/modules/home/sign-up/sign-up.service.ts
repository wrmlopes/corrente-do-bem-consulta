import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewUser } from './new-user';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/user/user';
// import { provideForRootGuard } from '@angular/router/src/router_module';

const usersUrl = environment.apiUrlCorrenteBrasilia + '/users';

@Injectable({
    providedIn: 'root'
  })
export class SignUpService {

    constructor(private http: HttpClient) {}

    checkEmailTaken(email: string): Observable<boolean> {

        return this.http.get<boolean>(`${usersUrl}/exists/${email}`);
    }

    signup(newUser: NewUser): Observable<User> {
        return this.http.post<User>(`${usersUrl}/signup`, newUser);
    }
}