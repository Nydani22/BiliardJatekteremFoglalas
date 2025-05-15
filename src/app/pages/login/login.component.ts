import { Component, OnInit, signal, inject, NgModule, OnDestroy } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { RouterLink } from '@angular/router';
import {merge, Subscription} from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})



export class LoginComponent implements OnInit, OnDestroy{
  isLoggedIn:boolean=false;
  authSub?:Subscription

  constructor(private authService:AuthService) {
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
  async login() {
    const emailValue = this.email.value || "";
    const passwordValue = this.password.value || "";

    try {
      await this.authService.signIn(emailValue, passwordValue);
      const role = await this.authService.getRole();

      if (role === 'admin') {
        localStorage.setItem('isAdmin',"true");
      }

      this.authService.updateLoginStatus(true);
      
      window.location.href = '/fooldal';

    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          this.loginError = "Nincs ilyen felhasználó!";
          break;
        case 'auth/wrong-password':
          this.loginError = "Hibás jelszó!";
          break;
        case 'auth/invalid-credential':
          this.loginError = "Hibás email vagy jelszó!";
          break;
        default:
          this.loginError = "Sikertelen, később próbáld újra!";
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
