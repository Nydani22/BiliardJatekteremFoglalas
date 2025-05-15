
import { ChangeDetectionStrategy,ChangeDetectorRef,Component, inject, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
import { FormatTimeRangePipe } from '../../shared/pipes/format-time-range.pipe';
import { TeremService } from '../../shared/services/terem.service';
import { IdopontService } from '../../shared/services/idopont.service';
import { Idopont } from '../../shared/model/idopontok';
import { Terem } from '../../shared/model/termek';
import { AuthService } from '../../shared/services/auth.service';
import { FoglalasokService } from '../../shared/services/foglalasok.service';
import { Foglalas } from '../../shared/model/foglalasok';

@Component({
  selector: 'app-foglalas',
  providers: [provideNativeDateAdapter()],
  imports: [MatGridListModule,MatListModule, MatSlideToggleModule, FormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatSelectModule, MatIconModule,MatButtonModule, MatSnackBarModule, FormatTimeRangePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './foglalas.component.html',
  styleUrl: './foglalas.component.scss'
})
export class FoglalasComponent implements OnInit {
  termek: Terem[] = [];
  idopontok: Idopont[] = [];
  selectedValue: string | null = null;
  selectedDay: Date | null = null;
  selectedIdopontId: string | null = null;
  isAccepted = false;

  today = new Date();

  constructor(
    private teremService: TeremService,
    private idopontService: IdopontService,
    private foglalasokService: FoglalasokService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.selectedDay = new Date();
    const storedTeremId = localStorage.getItem('teremId');
    if (storedTeremId) {
      this.selectedValue = storedTeremId;
      localStorage.removeItem('teremId');
    }
    this.loadTermek();
  }
  


  loadTermek() {
    this.teremService.getAllTermek().subscribe((data) => {
      this.termek = data;
      if (this.selectedValue && this.selectedDay) {
        this.loadIdopontok(this.selectedValue, this.selectedDay);
      }
      this.cdr.markForCheck();
    });
  }

  loadIdopontok(teremId: string, date: Date) {
    const dateString = this.formatDateToLocalString(date);
    this.idopontService
      .getIdopontokByTeremIdAndDate(teremId, dateString)
      .subscribe((data) => {
        this.idopontok = data.filter((ido) => ido.available);
        this.cdr.markForCheck();
      });
  }

  formatDateToLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
  onDateChange(date: Date) {
    this.selectedDay = date;
    if (this.selectedValue && this.selectedDay) {
      this.loadIdopontok(this.selectedValue, this.selectedDay);
    }
  }

  reload() {
    setTimeout(() => {
      this.selectedIdopontId = null;
      if (this.selectedValue && this.selectedDay) {
        this.loadIdopontok(this.selectedValue, this.selectedDay);
      } else {
        this.idopontok = [];
        this.cdr.markForCheck();
      }
    });
  }


  getTeremById(id: string): Terem | undefined {
    return this.termek.find((t) => t.id === id);
  }

  async foglal() {
    if (!this.selectedIdopontId) {
      this.snackbar.open("Válassz időpontot.", "Ok", { duration: 5000 });
      return;
    }

    if (!this.isAccepted) {
      this.snackbar.open("Fogadd el a szerződési feltételeket!", "Ok", { duration: 5000 });
      return;
    }

    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) throw new Error('Nincs bejelentkezett felhasználó.');

      const foglalas: Omit<Foglalas, 'id'> = {
        userid: currentUser.uid,
        idopontid: this.selectedIdopontId[0]
      };
      await this.foglalasokService.addFoglalas(foglalas);
      await this.idopontService.updateIdopontAvailability(this.selectedIdopontId[0], false);
      this.snackbar.open("Sikeres foglalás létrehozva.", "Ok", { duration: 5000 });
    } catch (error) {
      console.error('Hiba a foglalás létrehozásakor:', error);
      throw error;
    }
  }


  trackByTeremId(index: number, item: Terem) {
    return item.id;
  }

  trackByIdopontId(index: number, item: Idopont) {
    return item.id;
  }
}
  