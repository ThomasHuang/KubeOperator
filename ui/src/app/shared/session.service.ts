import {Injectable} from '@angular/core';
import {SignInCredential} from './signInCredential';
import {Observable} from 'rxjs';
import {Profile, SessionUser} from './session-user';
import {HttpClient} from '@angular/common/http';

const authUserUrl = '/api/v1/token/auth/';
const profileUrl = '/api/v1/profile/';
const refreshUrl = '/api/v1/token/refresh/';
const userUrl = '/api/v1/users/';
const changePassUrl = '/api/v1/password';
const queryKey = 'profile';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) {
  }

  authUser(signInCredential: SignInCredential): Observable<Profile> {
    const credential = {
      username: signInCredential.principal,
      password: signInCredential.password
    };
    return this.http.post<Profile>(authUserUrl, credential);
  }

  refreshToken(token: string) {
    return this.http.post<Profile>(refreshUrl, {token: token});
  }


  cacheProfile(profile: Profile) {
    localStorage.setItem(queryKey, JSON.stringify(profile));
  }

  setCacheUser(user: SessionUser) {
    const profile = JSON.parse(localStorage.getItem(queryKey));
    profile.user = user;
    this.cacheProfile(profile);
  }

  getCacheProfile(): Profile {
    const profile = localStorage.getItem(queryKey);
    if (profile !== null) {
      return JSON.parse(profile);
    }
    return null;
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(profileUrl);
  }

  changeItem(name: string): Observable<Profile> {
    return this.http.patch<Profile>(profileUrl, {current_item: name});
  }


  changePassword(original: string, password: string): Observable<any> {
    return this.http.post<any>(changePassUrl, {'original': original, 'password': password});
  }

  clear(): void {
    localStorage.removeItem('current_user');
  }

}
