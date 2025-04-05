import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoglalasComponent } from './foglalas.component';

describe('FoglalasComponent', () => {
  let component: FoglalasComponent;
  let fixture: ComponentFixture<FoglalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoglalasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoglalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
