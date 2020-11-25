import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import emailLine from '@iconify/icons-clarity/email-line';
import lockPasswordLine from '@iconify/icons-ri/lock-password-line';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './../login-signup.scss']
})
export class LoginComponent implements OnInit {
  emailLine = emailLine;
  lockPasswordLine = lockPasswordLine;
  isLoading = false;

  onLogin(form: NgForm){
    
  }

  constructor() { }

  ngOnInit(): void {
  }

}
