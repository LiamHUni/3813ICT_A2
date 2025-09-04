import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account-service';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  username: string = "";
  email: string = "";
  password: string = "";
  conPassword: string = "";

  errorMessage:string="";
  successMessage:string="";

  constructor(private accountService:AccountService){}

  submit(){
    this.errorMessage = "";
    this.successMessage = "";

    if(this.username && this.email && this.password && this.conPassword){
      if(this.password === this.conPassword){
        this.accountService.createUserRequest(this.username, this.email, this.password).subscribe(
          res=>{
            if(res.valid){
              this.successMessage = res.mess;
              this.username = "";
              this.email = "";
              this.password = "";
              this.conPassword = "";
            }else{
              this.errorMessage = res.mess;
            }
          }
        )
      }else{
        //Displays error if passwords don't match
        this.errorMessage = "Password must match"
      }
    
    }else{
      //Displays error if there are empty fields
      this.errorMessage = "All fields must be filled"
    }
  }
}
