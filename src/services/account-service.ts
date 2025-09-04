import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

//Format for groups inside user information
interface groups {
  name: string,
  id: number,
  admin: boolean,
  created: boolean
}

//Format for returned user information
interface userResult {
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
  /*
  *
  * Routing functions
  * 
  */
 //Sets base url for /account/??? routes
  url="http://localhost:3000/account/";

  constructor(private http: HttpClient){}
  serviceUserInfo:any;


  //Posts inputted email and password for requesting sign in
  signInRequest(username:string, password:string) {
    return this.http.post<userResult>(this.url+"login", {username, password});
  }

  createUserRequest(username: string, email: string, password: string){
    return this.http.post<createResult>(this.url+"create", {username, email, password});
  }

  //Creates observable to notify when localstorage is updated
  private changeSubject = new Subject<{}>();
  public changes$ = this.changeSubject.asObservable();
  
  notifyChange():void{
    this.changeSubject.next({});
  }

  //Retrieves user info from server, used to update info after editing
  updateUserInfo(username: string){
    this.http.post<userResult>(this.url+"retrieve", {username}).subscribe(
      res=>{
        localStorage.setItem("userInfo", JSON.stringify(res));
        //Triggers observers to check local storage
        this.notifyChange();
      }
    )  
  }


}
