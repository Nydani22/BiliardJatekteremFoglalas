import { Component, OnInit } from '@angular/core';
import { IdopontService } from '../../shared/services/idopont.service';
import { TeremService } from '../../shared/services/terem.service';
import { Idopont } from '../../shared/model/idopontok';
import { Terem } from '../../shared/model/termek';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  imports: [FormsModule,CommonModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatListModule,
    MatIconModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  idopontok: Idopont[] = [];
  termek: Terem[] = [];
  kezdIdo: string = '';
  vegIdo: string = '';

  ujIdopont: Omit<Idopont, 'id'> = {
    teremid: '',
    date: '',
    intervallum: '',
    available: true,
  };


  ujTerem: Omit<Terem, 'id'> = {
    terem_kep_url: '',
    kep_title: '',
    terem_nev: '',
    asztalok_szama: 0,
    oradij: 0,
    maximum_ferohely: 0,
  };

  editingTeremId: string | null = null;
  editTeremData: Partial<Terem> = {};

  constructor(
    private idopontService: IdopontService,
    private teremService: TeremService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadIdopontok();
    this.loadTermek();
  }

  getTeremNev(teremid: string): string {
    const terem = this.termek.find(t => t.id === teremid);
    return terem ? terem.terem_nev : 'Nincs terem';
  }

  loadIdopontok(): void {
    this.idopontService.getAllIdopontok().subscribe(data => {
      this.idopontok = data;
    });
  }

  createIdopont(): void {
    if (!this.validateIdoIntervallum(this.kezdIdo, this.vegIdo)) {
      this.snackBar.open("Az időintervallum hibás. Csak 08:00–22:00 között, és legalább 1 óra különbséggel engedélyezett.", "Ok", { duration: 5000 });
      return;
    }
    const formattedDate = this.formatDate(this.ujIdopont.date);
    this.ujIdopont.intervallum = `${this.kezdIdo}-${this.vegIdo}`;
    const ujIdopontFormatted = {
      ...this.ujIdopont,
      intervallum: this.ujIdopont.intervallum,
      date: formattedDate,
    };

    

    this.idopontService.createIdopont(ujIdopontFormatted).then(() => {
      this.loadIdopontok();
      this.ujIdopont = {
        teremid: '',
        date: '',
        intervallum: '',
        available: true,
      };
      this.kezdIdo = '';
      this.vegIdo = '';
    });
  }


  private formatDate(date: any): string {
    if (typeof date === 'string') return date;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  }



  validateIdoIntervallum(kezd: string, veg: string): boolean {
    if (!kezd || !veg) return false;

    const [kezdOra, kezdPerc] = kezd.split(':').map(Number);
    const [vegOra, vegPerc] = veg.split(':').map(Number);

    const kezdIdo = kezdOra * 60 + kezdPerc;
    const vegIdo = vegOra * 60 + vegPerc;

    const minKezd = 8 * 60;
    const maxVeg = 22 * 60;

    return (
      kezdIdo >= minKezd &&
      vegIdo <= maxVeg &&
      vegIdo - kezdIdo >= 60
    );
  }

  



  deleteIdopont(id: string): void {
    this.idopontService.deleteIdopont(id).then(() => {
      this.loadIdopontok();
    });
  }


  loadTermek(): void {
    this.teremService.getAllTermek().subscribe(data => {
      this.termek = data;
    });
  }

  createTerem(): void {
    this.teremService.createTerem(this.ujTerem).then(() => {
      this.loadTermek();
      this.ujTerem = {
        terem_kep_url: '',
        kep_title: '',
        terem_nev: '',
        asztalok_szama: 0,
        oradij: 0,
        maximum_ferohely: 0,
      };
    });
  }

  editTerem(terem: Terem): void {
    this.editingTeremId = terem.id;
    this.editTeremData = { ...terem };
  }

  updateTerem(): void {
    if (this.editingTeremId) {
      this.teremService.updateTerem(this.editingTeremId, this.editTeremData).then(() => {
        this.editingTeremId = null;
        this.editTeremData = {};
        this.loadTermek();
      });
    }
  }

  cancelEdit(): void {
    this.editingTeremId = null;
    this.editTeremData = {};
  }

  deleteTerem(id: string): void {
    this.teremService.deleteTerem(id).then(() => {
      this.loadTermek();
    });
  }
}
