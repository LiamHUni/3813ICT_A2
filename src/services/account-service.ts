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
interface results {
  username: string,
  email: string,
  id: number,
  roles: string[],
  groups: groups[],
  valid: boolean
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
  signInRequest(email:string, password:string) {
    return this.http.post<results>(this.url+"login", {email, password});
  }
}
