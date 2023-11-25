import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceFormDialogComponent } from './absence-form-dialog.component';

describe('AbsenceFormDialogComponent', () => {
  let component: AbsenceFormDialogComponent;
  let fixture: ComponentFixture<AbsenceFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
