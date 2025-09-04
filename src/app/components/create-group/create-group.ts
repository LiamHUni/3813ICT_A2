import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../services/group-service';
import { AccountService } from '../../../services/account-service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  imports: [FormsModule],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css'
})
export class CreateGroup {
  name: string = "";

  errorMessage:string="";
  successMessage:string="";

  constructor(private router:Router, private groupService:GroupService, private accountService:AccountService){}


  submit(){
    //Clears error and success messages
    this.errorMessage = "";
    this.successMessage = "";

    if(this.name){
      //Gets username
      const data = localStorage.getItem("userInfo");
      let userInfo:any;
      if(data){
        userInfo = JSON.parse(data);
      }

      //Sends request to create group
      this.groupService.createGroupRequest(this.name, userInfo.username).subscribe(
        res=>{
          if(res.valid){
            this.successMessage = res.mess;
            this.name = "";
            this.accountService.updateUserInfo(userInfo.username);
          }else{
            this.errorMessage = res.mess;
          }
        }
      )
    }else{
      //Displays error if name field is empty
      this.errorMessage = "Please insert group name"
    }
  }
}
