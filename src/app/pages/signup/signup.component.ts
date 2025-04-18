import { Component, OnInit, signal } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { FormControl,FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { merge } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
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
  hide2 = signal(true);
  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2());
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

  username=new FormControl('',Validators.minLength(4));
  password=new FormControl('',Validators.minLength(7));
  password2=new FormControl('',Validators.minLength(7));
  registerError:String="";
  signup() {
    //console.log("belepett");
    if (this.email.value!==null && this.password.value !== null && this.password.value===this.password2.value && this.username.value!==null) {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href='/fooldal';
    } else {
      this.registerError="Hibás email vagy jelszó!";
    }
  }
}
