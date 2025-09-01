import { Component } from '@angular/core';
// import { GroupBrowser } from '../group-browser/group-browser';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

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

  constructor(private router:Router){}

  ngOnInit(){
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
}
