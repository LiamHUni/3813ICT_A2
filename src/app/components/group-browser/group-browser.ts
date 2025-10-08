import { Component } from '@angular/core';
import { AccountService } from '../../../services/account-service';
import { GroupService } from '../../../services/group-service';

@Component({
  selector: 'app-group-browser',
  imports: [],
  templateUrl: './group-browser.html',
  styleUrl: './group-browser.css'
})
export class GroupBrowser {
  userInfo:any;
  groups:any;

  constructor(private accountService:AccountService, private groupService:GroupService){}

  ngOnInit(){
    this.updateUserInfo();
    this.retrieveAll();

    // Subscribes to observable, triggers when local storage 'userInfo' is updated
    this.accountService.changes$.subscribe(({})=>{
      this.updateUserInfo();
    });
  }
  
  // Retrieves user data from local storage
  updateUserInfo(){    
    const data = localStorage.getItem("userInfo");
    if(data){
      this.userInfo = JSON.parse(data);
    }
  }

  // Requests all group data from server through group service
  retrieveAll(){
    this.groupService.getAllGroups(this.userInfo.username).subscribe(
      res=>{
        this.groups = res;
      }
    )
  }

  // Sends join request to server through group service
  requestJoin(groupID: number){
    this.groupService.requestAccess(this.userInfo.username, groupID).subscribe(
      res=>{
        if(res.valid){
          this.retrieveAll();
        }
      }
    )
  }
}
