import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


interface genResults {
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
    return this.http.post<genResults>(this.url+"create", {name, user});
  }

  getAllGroups(username:any){
    return this.http.post<any>(this.url+"retrieveAll", {username});
  }

  getGroup(id:number){
    return this.http.post<groupResult>(this.url+"retrieve", {id});
  }
  
  requestAccess(username:string, groupID:number){
    return this.http.post<genResults>(this.url+"requestAccess", {username, groupID});
  }

  getRequests(groupID:number){
    return this.http.post<[]>(this.url+"getRequests", {groupID});
  }
  
  createChannel(groupID: number, channelName: string){
    return this.http.post<genResults>(this.url+"createChannel", {groupID, channelName});
  }

  deleteChannel(groupID: number, channelName: string){
    return this.http.post<genResults>(this.url+"deleteChannel", {groupID, channelName});
  }

  deleteGroup(groupID: number){
    return this.http.post<genResults>(this.url+"deleteGroup", {groupID});
  }
}
