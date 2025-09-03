import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username:string = "";
  password:string = "";
  errorMessage:string="";

  constructor(private accountService:AccountService, private router:Router){}

  submit(){
    if(this.username && this.password){
      this.errorMessage = "";
      this.accountService.signInRequest(this.username, this.password).subscribe(
        res=>{
          // console.log(res);
          if(res.valid){
            this.errorMessage = ""
            //Stores user information in local storage
            localStorage.setItem("userInfo", JSON.stringify(res));
            //Navigates to main screen
            this.router.navigateByUrl('/main/groupBrowser');
          }else{
            this.errorMessage = "Incorrect username or password";
          }      
        }
      );
    }else{
      this.errorMessage = "Both fields must be filled"
    }
  }
}
