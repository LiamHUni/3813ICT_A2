import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


interface createResult {
  valid: boolean,
  mess: string
}

interface groupResult {
  name: string,
  id: number,
  channels: channel[]
}

interface channel{
  name:string,
  id:number
}

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  //Sets base url for /group/??? routes
  url="http://localhost:3000/group/";

  constructor(private http: HttpClient){}

  curGroup$ = new BehaviorSubject<any>(null);

  //Posts inputted email and password for requesting sign in
  createGroupRequest(name:string, user:string) {
    return this.http.post<createResult>(this.url+"create", {name, user});
  }

  getGroup(id:number){
    return this.http.post<groupResult>(this.url+"retrieve", {id});
  }
}
