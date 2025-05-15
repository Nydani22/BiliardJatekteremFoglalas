import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/model/users';
import { Idopont } from '../../shared/model/idopontok';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdopontService } from '../../shared/services/idopont.service';
import { AuthService } from '../../shared/services/auth.service';
import {MatCardModule} from '@angular/material/card';
import { DatePipe } from '../../shared/pipes/date.pipe';
import { TeremService } from '../../shared/services/terem.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profil',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatCardModule,DatePipe, MatSnackBarModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit, OnDestroy {
  user: User | null = null;
  idopontok: Idopont[] = [];
  currentPassword: string = '';
  private subscription: Subscription | null = null;
  termekMap: Map<number, string> = new Map();


  constructor(
    private userService: UserService,
    private idopontService: IdopontService,
    private authService: AuthService, 
    private snackBar: MatSnackBar,
    private teremService: TeremService,
  ) {}

  ngOnInit(): void {
    this.loadProfil();
  }
  
  


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadProfil(): void {
    this.subscription = this.userService.getUserProfil().subscribe({
      next: (data) => {
        this.user = data.user;
        this.idopontok = data.idopontok;
        console.log(data)
      },
      error: (error) => {
        console.error("Hiba a profil betöltésekor:", error);
      }
    });
    this.teremService.getAllTermek().subscribe(termek => {
      this.termekMap = new Map(termek.map(t => [t.id, t.terem_nev]));
    });
  }
  

 

  async saveProfil() {
    if (!this.user || !this.currentPassword) return;
    try {
      const success = await this.authService.reauthenticate(this.currentPassword);
      if (!success) {
        this.snackBar.open("Hibás jelszó!", "Ok", {
          duration: 5000
        });
        return;
      }

      await this.userService.updateUserProfil(this.user.id, {
        username: this.user.username,
        email: this.user.email
      });

      this.snackBar.open("Sikeres mentés!", "Ok", {
        duration: 3000
      });
      this.currentPassword = '';
    } catch (err) {
      console.error("Mentési hiba:", err);
      this.snackBar.open("Hiba a mentés közben.", "Ok", {
        duration: 5000
      });
    }
  }

  async deleteProfil() {
    if (!this.user || !confirm("Biztosan törölni szeretnéd a fiókodat?")) return;
    try {
      await this.userService.deleteUserProfil(this.user.id);
      await this.authService.deleteCurrentUser();
    } catch (err) {
      console.error("Törlési hiba:", err);
    }
  }

  async deleteIdopont(id: string) {
    if (!confirm("Biztosan törölni szeretnéd ezt az időpontot?")) return;
    try {
      await this.idopontService.deleteIdopont(id);
      this.idopontok = this.idopontok.filter(i => i.id !== id);
      this.snackBar.open("Sikeres törlés.", "Ok", {
        duration: 3000
      });
    } catch (err) {
      console.error("Időpont törlési hiba:", err);
    }
  }
}
