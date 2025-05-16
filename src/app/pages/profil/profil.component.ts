import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin, of, switchMap } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/model/users';
import { Idopont } from '../../shared/model/idopontok';
import { FoglalasokService } from '../../shared/services/foglalasok.service';
import { IdopontService } from '../../shared/services/idopont.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeremService } from '../../shared/services/terem.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '../../shared/pipes/date.pipe';
import {MatCardModule} from '@angular/material/card';
import { Foglalas } from '../../shared/model/foglalasok';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirmdialog/confirmdialog.component'; 


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  imports: [MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, DatePipe, MatCardModule],
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit, OnDestroy {
  user: User | null = null;
  idopontok: Idopont[] = [];
  foglalasok: Foglalas[] = [];
  currentPassword: string = '';
  private subscription: Subscription | null = null;
  termekMap: Map<string, string> = new Map();

  constructor(
    private userService: UserService,
    private foglalasokService: FoglalasokService,
    private idopontService: IdopontService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private teremService: TeremService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadProfil();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadProfil(): void {
    this.subscription = this.userService.getUserProfil().pipe(
      switchMap((user) => {
        this.user = user;
        if (!user) return of([]);
        return this.foglalasokService.getFoglalasokByUserId(user.id);
      }),
      switchMap((foglalasok) => {
        this.foglalasok = foglalasok;
        if (!foglalasok.length) return of([]);
        const idopontRequests = foglalasok.map(f =>
          this.idopontService.getIdopontById(f.idopontid)
        );
        return forkJoin(idopontRequests);
      })
      ).subscribe({
        next: (idopontok) => {
          this.idopontok = idopontok.filter(i => i !== null) as Idopont[];
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
    if (!this.user) {
      return; 
    } else if (!this.currentPassword) {
      this.snackBar.open("Add meg a jelszót!", "Ok", { duration: 5000 });
      return;
    }
     
    try {
      const success = await this.authService.reauthenticate(this.currentPassword);
      if (!success) {
        this.snackBar.open("Hibás jelszó!", "Ok", { duration: 5000 });
        return;
      }

      await this.userService.updateUserProfil(this.user.id, {
        username: this.user.username
      });

      this.snackBar.open("Sikeres mentés!", "Ok", { duration: 3000 });
      this.currentPassword = '';
    } catch (err) {
      console.error("Mentési hiba:", err);
      this.snackBar.open("Hiba a mentés közben.", "Ok", { duration: 5000 });
    }
  }

  async deleteProfil() {
    if (!this.user) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: "Biztosan törölni szeretnéd a fiókodat?" }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) return;

    try {
      await this.userService.deleteUserProfil(this.user.id);
      await this.authService.deleteCurrentUser();
    } catch (err) {
      console.error("Törlési hiba:", err);
    }
  }

  
  getFoglalasIdByIdopont(idopontId: string): string | undefined {
    return this.foglalasok.find(f => f.idopontid === idopontId)?.id;
  }

  async deleteFoglalas(id: string, idoid: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: "Biztosan törölni szeretnéd ezt a foglalást?" }
    });
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) return;
    try {
      console.log("halo");
      await this.foglalasokService.deleteFoglalas(id);
      await this.idopontService.updateIdopontAvailability(idoid,true);
      this.foglalasok = this.foglalasok.filter(f => f.id !== id);
      this.idopontok = this.idopontok.filter(i => {
        return !this.foglalasok.some(f => f.idopontid === i.id);
      });
      this.loadProfil();
      this.snackBar.open("Sikeres törlés.", "Ok", { duration: 3000 });
    } catch (err) {
      console.error("Foglalás törlési hiba:", err);
    }
  }

}
