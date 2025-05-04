import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms' 
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    Email : "",
    Password: ""
  }

  http =  inject(HttpClient);

  constructor(private router:Router){}
  onlogin(){
    this.http.post("http://196.219.184.42/Abdullatif_Backend/api/Auth/login" , this.loginObj)
    .subscribe((res:any)=>{
      if(res.status == 200){
        alert("sucess")
        console.log(res.token);
        localStorage.setItem('authToken', res.token);
        this.router.navigateByUrl("/dashboard");
      }else{
        alert("Faild")
      }
    })
  }
}
