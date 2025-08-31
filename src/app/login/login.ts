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

  email:string = "";
  password:string = "";
  errorMessage:string="";

  constructor(private accountService:AccountService, private router:Router){}

  submit(){
    console.log("signed in");
    this.accountService.signInRequest(this.email, this.password).subscribe(
      res=>{
        // console.log(res);
        if(res.valid){
          this.errorMessage = ""
          //Stores user information in local storage
          localStorage.setItem("userInfo", JSON.stringify(res));
          //Navigates to main screen
          this.router.navigateByUrl('/main');
        }else{
          localStorage.removeItem("userInfo");  //Currently for debugging as there's no proper way to clear user information from local storage
          this.errorMessage = "Incorrect email or password";
        }      
      }
    );
  }
}
