import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface createResult {
  valid: boolean,
  mess: string
}

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  //Sets base url for /group/??? routes
  url="http://localhost:3000/group/";

  constructor(private http: HttpClient){}

  //Posts inputted email and password for requesting sign in
  createGroupRequest(name:string) {
    return this.http.post<createResult>(this.url+"create", {name});
  }
}
