import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Termek } from '../../shared/data';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-foglalas',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatGridListModule,
    MatListModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './foglalas.component.html',
  styleUrls: ['./foglalas.component.scss'],
})
export class FoglalasComponent {
  today!: Date;
  Termek = Termek;
  selectedValue: string = '';
  chosenDate: Date | null = null; // Kezdetben null, üres dátumot jelent
  teremId: number = 0;
  stored = localStorage.getItem('teremId');
  id = this.stored ? parseInt(this.stored, 10) : null;

  ngOnInit(): void {
    if (this.id !== null) {
      this.selectedValue = this.termek[this.id - 1].value;
    } else {
      this.selectedValue = this.termek[0].value;
    }
    this.today = new Date(); // Beállítjuk a mai dátumot
    localStorage.removeItem('teremId');
  }

  reload() {}

  idopontok = [
    { value: '1', view: { Value: '12:00-13:00', available: true } },
    { value: '2', view: { Value: '13:00-14:00', available: true } },
    { value: '3', view: { Value: '14:00-15:00', available: false } },
    { value: '4', view: { Value: '15:00-16:00', available: false } },
    { value: '5', view: { Value: '16:00-17:00', available: true } },
    { value: '6', view: { Value: '17:00-18:00', available: true } },
    { value: '7', view: { Value: '18:00-19:00', available: true } },
    { value: '8', view: { Value: '19:00-20:00', available: true } },
  ];
  termek = [
    { value: '1', viewValue: '1. Terem' },
    { value: '2', viewValue: '2. Terem' },
    { value: '3', viewValue: '3. Terem' },
    { value: '4', viewValue: '4. Terem' },
    { value: '5', viewValue: '5. Terem' },
  ];
}
