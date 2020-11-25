import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import emailLine from '@iconify/icons-clarity/email-line';
import lockPasswordLine from '@iconify/icons-ri/lock-password-line';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', './../login-signup.scss']
})
export class SignupComponent implements OnInit {

  emailLine = emailLine;
  lockPasswordLine = lockPasswordLine;

  onSignup(form: NgForm){
    
  }

  constructor() { }

  ngOnInit(): void {
  }

}
