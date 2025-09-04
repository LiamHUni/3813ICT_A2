import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-main-screen',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-screen.html',
  styleUrl: './main-screen.css'
})

export class MainScreen {

  //Empty user information format
  userInfos = {
    username: "",
    email: "",
    roles: [] as string[],
    groups: [] as []
  }

  userInfo:any;

  constructor(private router:Router, private accountService:AccountService){}

  ngOnInit(){
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
    //Navigates to login screen
    this.router.navigateByUrl('');
  }

  openGroup(id:number){
    console.log(id);
  }
}
