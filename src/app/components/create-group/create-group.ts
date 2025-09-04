import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../services/group-service';

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

  constructor(private groupService:GroupService){}


  submit(){
    //Clears error and success messages
    this.errorMessage = "";
    this.successMessage = "";

    if(this.name){
      this.groupService.createGroupRequest(this.name).subscribe(
        res=>{
          if(res.valid){
            this.successMessage = res.mess;
            this.name = "";
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
