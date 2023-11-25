import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceConfirmDialogComponent } from './absence-confirm-dialog.component';

describe('AbsenceConfirmDialogComponent', () => {
  let component: AbsenceConfirmDialogComponent;
  let fixture: ComponentFixture<AbsenceConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceConfirmDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
