import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Format for groups inside user information
interface groups {
  name: string,
  id: number,
  admin: boolean,
  created: boolean
}

//Format for returned user information
interface loginResult {
  username: string,
  email: string,
  roles: string[],
  groups: groups[],
  valid: boolean
}

interface createResult {
  valid: boolean,
  mess: string
}

@Injectable({
  providedIn: 'root'
})


export class AccountService {
  //Sets base url for /account/??? routes
  url="http://localhost:3000/account/";

  constructor(private http: HttpClient){
  }

  //Posts inputted email and password for requesting sign in
  signInRequest(username:string, password:string) {
    return this.http.post<loginResult>(this.url+"login", {username, password});
  }

  createUserRequest(username: string, email: string, password: string){
    return this.http.post<createResult>(this.url+"create", {username, email, password});
  }
}
