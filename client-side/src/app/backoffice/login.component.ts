import { Component, OnInit } from '@angular/core';
import { LoginService} from '../domain/login.service'
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiResponse } from '../domain/model';

@Component({
  selector: 'app-backoffice',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup
  loggingIn: boolean = false
  error?: string = undefined

  constructor(private loginService: LoginService,
    private router: Router, 
    private _formBuilder: FormBuilder){
  }
  
  ngOnInit() { 
    this.loginForm = this._formBuilder.group({
      username: [],
      password: [] 
    });
  }
  login(): void {
    this.error = undefined
    if(this.loginForm.valid){
      this.loggingIn = true
      const username = this.loginForm.get('username')!.value
      const password = this.loginForm.get('password')!.value
      this.loginService.login(username, password).subscribe((response: ApiResponse) => {
          console.log(`Was login successful? ${response.success}`)
          this.loggingIn = false
          if(response.success){
            this.router.navigate(['/backoffice'])
          }else{
            this.error = response.error
          }
      })
    }
  }
}