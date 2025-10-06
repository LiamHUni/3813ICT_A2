import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { GroupService } from '../../services/group-service';
import { UserManager } from '../components/user-manager/user-manager';

@Component({
  selector: 'app-main-screen',
  imports: [CommonModule, RouterOutlet, UserManager],
  templateUrl: './main-screen.html',
  styleUrl: './main-screen.css'
})

export class MainScreen {

  userInfo:any;

  userManager: boolean = false;

  constructor(private router:Router, private accountService:AccountService, private groupService:GroupService){}

  ngOnInit(){
    this.userManager = false;
    this.updateUserInfo();

    //Subscribes to observable, triggers when local storage 'userInfo' is updated
    this.accountService.changes$.subscribe(({})=>{
      this.updateUserInfo();
    });
  }
  
  updateUserInfo(){    
    // console.log("Updated from local stroage");
    const data = localStorage.getItem("userInfo");
    if(data){
      this.userInfo = JSON.parse(data);
    }
  }

  logout(){
    //Removes user information from local storage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentGroup");
    //Navigates to login screen
    this.router.navigateByUrl('');
  }

  openGroup(id:number){
    //Sends group id through observer
    //Converts to string to prevent '0' being set to ''
    this.groupService.curGroup$.next(String(id));
    this.router.navigateByUrl('/main/groupChat');
    this.userManager = false;
  }

  toggleUserManager(){
    this.userManager = true;
  }

  deleteSelf(){
    this.accountService.deleteUser(this.userInfo.username).subscribe(
      res=>{
        if(res.valid){
          this.logout();
        }
      }
    );
  }
}
