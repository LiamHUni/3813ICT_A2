import { Component, Input } from '@angular/core';
import { AccountService } from '../../../services/account-service';
import { GroupService } from '../../../services/group-service';

@Component({
  selector: 'app-user-manager',
  imports: [],
  templateUrl: './user-manager.html',
  styleUrl: './user-manager.css'
})
export class UserManager {
  @Input() groupID!: number;
  @Input() username!: string;

  joinRequests: any;
  users: any;

  constructor(private accountService:AccountService, private groupService:GroupService){}

  ngOnInit(){
    if(this.groupID){
      this.retrieveGroupUsers();
      this.retrieveJoinRequests();
    }else{
      this.retrieveAllUsers();
    }
  }

  //Gets all users if page is used for all user management
  retrieveAllUsers(){
    this.accountService.retrieveAll(this.username).subscribe(
      res=>{
        this.users = res;
        console.log(this.users);
      }
    );
  }


  //Gets join requests if used for group user management
  retrieveJoinRequests(){
    this.groupService.getRequests(this.groupID).subscribe(
      res=>{
        this.joinRequests = res;
        console.log(this.joinRequests);
      }
    );
  }

  answerRequest(username: string, allow: boolean){
    this.accountService.joinGroup(username, this.groupID, allow).subscribe(
      res=>{
        if(res.valid){
          this.retrieveJoinRequests();
          this.retrieveGroupUsers();
        }
      }
    );
  }
  
  //Gets group users if used for group user management
  retrieveGroupUsers(){
    this.accountService.allOfGroup(this.username, this.groupID).subscribe(
      res=>{
        this.users = res;
      }
    );
  }

  //Button functions
  editRoles(){

  }

  kickFromGroup(username:string){
    this.accountService.leaveGroup(this.groupID, username).subscribe(
      res=>{
        if(res.valid){
          this.retrieveGroupUsers();
        }
      }
    );
  }

  deleteUser(username:string){
    this.accountService.deleteUser(username).subscribe(
            res=>{
        if(res.valid){
          this.retrieveGroupUsers();
        }
      }
    );
  }

}
