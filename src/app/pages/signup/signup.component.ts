import { Component, OnInit, signal } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { FormControl,FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { merge } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/model/users';

@Component({
  selector: 'app-signup',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  isLoggedIn:boolean=false;
  usernameError = signal('');
  emailError = signal('');
  passwordError = signal('');
  password2Error = signal('');


  
  constructor(private authService:AuthService) {
      merge(
        this.email.statusChanges, this.email.valueChanges,
        this.username.statusChanges, this.username.valueChanges,
        this.password.statusChanges, this.password.valueChanges,
        this.password2.statusChanges, this.password2.valueChanges
      ).pipe(takeUntilDestroyed()).subscribe(() => this.updateFieldErrors());

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

  updateFieldErrors() {
    if (this.username.touched || this.username.dirty) {
      if (this.username.hasError('required')) {
        this.usernameError.set('Be kell írnod egy felhasználónevet');
      } else if (this.username.hasError('minlength')) {
        this.usernameError.set('A felhasználónévnek legalább 4 karakter hosszúnak kell lennie');
      } else {
        this.usernameError.set('');
      }
    }

    if (this.email.touched || this.email.dirty) {
      if (this.email.hasError('required')) {
        this.emailError.set('Be kell írnod egy emailt');
      } else if (this.email.hasError('email')) {
        this.emailError.set('Helytelen email');
      } else {
        this.emailError.set('');
      }
    }

    if (this.password.touched || this.password.dirty) {
      if (this.password.hasError('required')) {
        this.passwordError.set('Be kell írnod egy jelszót');
      } else if (this.password.hasError('minlength')) {
        this.passwordError.set('A jelszónak legalább 7 karakter hosszúnak kell lennie');
      } else {
        this.passwordError.set('');
      }
    }

    if (this.password2.touched || this.password2.dirty) {
      if (this.password2.hasError('required')) {
        this.password2Error.set('Meg kell ismételned a jelszót');
      } else if (this.password2.value !== this.password.value) {
        this.password2Error.set('A két jelszó nem egyezik');
      } else {
        this.password2Error.set('');
      }
    }
  }



  username=new FormControl('',[Validators.required,Validators.minLength(4)]);
  password=new FormControl('',[Validators.required, Validators.minLength(7)]);
  password2=new FormControl('',[Validators.required, Validators.minLength(7)]);
  signup() {
    if (
      this.email.valid &&
      this.password.valid &&
      this.password2.valid &&
      this.username.valid &&
      this.password.value === this.password2.value
    ) {
      const userData: Partial<User> = {
        username: this.username.value!,
        email: this.email.value!
      };

      this.authService.signUp(this.email.value!, this.password.value!, userData)
        .then(userCredential => {
          console.log("Regisztráció sikeres.", userCredential.user);
          this.authService.updateLoginStatus(true);
          window.location.href = '/fooldal';
        })
        .catch(error => {
          console.log("Regisztráció hiba: ", error);
          switch (error.code) {
            case "auth/email-already-in-use":
              this.errorMessage.set("Ez az email már használt."); break;
            case "auth/invalid-email":
              this.errorMessage.set("Érvénytelen email."); break;
            case "auth/weak-password":
              this.errorMessage.set("Gyenge jelszó."); break;
            default:
              this.errorMessage.set("Próbáld újra később.");
          }
        });
    } else {
      this.errorMessage.set("Hibás adatok! Ellenőrizd a mezőket.");  
    }

  }
}
