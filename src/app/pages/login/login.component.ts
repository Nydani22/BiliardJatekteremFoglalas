import { Component, OnInit, signal, inject, NgModule } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { RouterLink } from '@angular/router';
import {merge} from 'rxjs';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



export class LoginComponent implements OnInit{
  isLoggedIn:boolean=false;

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');


  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn=localStorage.getItem('isLoggedIn')==="true";
    if (this.isLoggedIn) {
      window.location.href='/fooldal';
    }
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  
  password=new FormControl('');
  loginError:String="";
  login() {
    //console.log("belepett");
    if (this.email.value==="test@test.com" && this.password.value === "test") {
      localStorage.setItem("isLoggedIn","true");
      window.location.href='/fooldal';
    } else {
      this.loginError="Hibás email vagy jelszó!";
    }

  }
}
