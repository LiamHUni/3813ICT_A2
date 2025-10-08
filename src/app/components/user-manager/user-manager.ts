import { Component, Input } from '@angular/core';
import { AccountService } from '../../../services/account-service';
import { GroupService } from '../../../services/group-service';
import { FormsModule } from '@angular/forms';

interface User{
  username:string,
  roles: [],
  admin: boolean
}

@Component({
  selector: 'app-user-manager',
  imports: [FormsModule],
  templateUrl: './user-manager.html',
  styleUrl: './user-manager.css'
})

export class UserManager {
  // Gets values given by parent component
  @Input() groupID!: number;
  @Input() username!: any;

  joinRequests: any;
  users: User[] = [];
  
  userToEdit: any;
  roles: any;

  constructor(private accountService:AccountService, private groupService:GroupService){}

  ngOnInit(){
    console.log("ID" + this.groupID);
    // If page is being used inside a group, retrieves group users and join requests
    // If not, retireves all users information
    if(this.groupID){
      this.retrieveGroupUsers();
      this.retrieveJoinRequests();
    }else{
      this.retrieveAllUsers();
    }
  }

  // Gets all users if page is used for all user management
  retrieveAllUsers(){
    this.accountService.retrieveAll(this.username).subscribe(
      res=>{
        this.users = res;
      }
    );
  }


  // Gets join requests if used for group user management
  retrieveJoinRequests(){
    this.groupService.getRequests(this.groupID).subscribe(
      res=>{
        this.joinRequests = res;
        console.log(this.joinRequests);
      }
    );
  }

  // Used to accept or decline join request
  answerRequest(username: string, allow: boolean){
    // Sends user's username, group ID, and join decision to server
    this.accountService.joinGroup(username, this.groupID, allow).subscribe(
      res=>{
        // Reloads page information
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

  // Button function
  editRoles(username:string){
    this.userToEdit = this.users.find(u=>u.username === username);
    this.roles = this.userToEdit.roles;
  }

  confirmRoleEdit(){
    this.userToEdit = "";
  }

  // Sends username and groupID to server through account service to remove user from group
  kickFromGroup(username:string){
    this.accountService.leaveGroup(this.groupID, username).subscribe(
      res=>{
        // Upon succesful deletion, update group list
        if(res.valid){
          this.retrieveGroupUsers();
        }
      }
    );
  }

  // Sends username to server through account service to delete user account
  deleteUser(username:string){
    this.accountService.deleteUser(username).subscribe(
      res=>{
        if(res.valid){
          if(this.groupID){
            this.retrieveGroupUsers();
          }else{
            this.retrieveAllUsers();
          }
        }
      }
    );
  }
}
