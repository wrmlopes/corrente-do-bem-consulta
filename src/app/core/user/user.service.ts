import { Injectable } from '@angular/core';
import { TokenService } from 'src/app/core/token/token.service';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { UserProfile } from 'src/app/shared/models';

@Injectable({ providedIn: 'root'})
export class UserService { 

    private userSubject = new BehaviorSubject<UserProfile>(null);

    private userProfile: UserProfile;

    constructor(private tokenService: TokenService) { 

        this.tokenService.hasToken() && 
            this.decodeAndNotify();
    }

    setToken(token: string) {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getUser() {
        return this.userSubject.asObservable();
    }

    /**
     * Propaga o token para uso nos componentes
     */
    private decodeAndNotify() {
        const token = this.tokenService.getToken();
        const user = jwt_decode(token) as UserProfile;
        this.userSubject.next(user);
    }

    logout() {
        this.tokenService.removeToken();
        this.userSubject.next(null);
    }

    isLogged() {
        return this.tokenService.hasToken();
    }

    getUserName() {
        return (this.userProfile?.nome || '');
    }
}