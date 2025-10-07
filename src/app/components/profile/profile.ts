import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AccountService } from '../../../services/account-service';
import { GroupService } from '../../../services/group-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  userInfo:any;
  profileImage: string | null = null;


  constructor(private router:Router, private accountService:AccountService, private groupService:GroupService){}

  ngOnInit(){
    this.updateUserInfo();
    //Subscribes to observable, triggers when local storage 'userInfo' is updated
    this.accountService.changes$.subscribe(({})=>{
      this.updateUserInfo();
    });
    console.log(this.userInfo);
    this.profileImage = this.userInfo.pfpImage;
  }
  
  updateUserInfo(){    
    const data = localStorage.getItem("userInfo");
    if(data){
      this.userInfo = JSON.parse(data);
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.profileImage = reader.result as string;
      this.accountService.updateProfileImage(this.userInfo.username, this.profileImage).subscribe(
        res=>{
          if(res.valid){
            this.accountService.updateUserInfo(this.userInfo.username);
          }
        }
      );
    };

    reader.onerror = error => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file); // Converts to Base64
  }

  deleteSelf(){
    if(confirm("Are you sure you want to delete your account?\nThis can not be undone")){
      this.accountService.deleteUser(this.userInfo.username).subscribe(
        res=>{
          if(res.valid){
            this.logout();
          }
        }
      );
    }
  }

    logout(){
    //Removes user information from local storage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("currentGroup");
    //Navigates to login screen
    this.router.navigateByUrl('');
  }
}
