import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/user/user';
import { NewUser } from '../sign-up/new-user';
// import { provideForRootGuard } from '@angular/router/src/router_module';

const usersUrl = environment.apiUrlCorrenteBrasilia + '/users';

@Injectable({
    providedIn: 'root'
  })
export class SignInService {

    constructor(private http: HttpClient) {}

    checkEmailTaken(email: string): Observable<boolean> {

        return this.http.get<boolean>(`${usersUrl}/exists/ ${email}`);
    }

    /**
     * executa o login ==>> Promise
     * @param userCredential 
     */
    async signin(userCredential: {email: string, password: string}): Promise<{token: string}> {
        return this.http.post<{token: string}>(`${usersUrl}/login`, userCredential).toPromise();
    }
}