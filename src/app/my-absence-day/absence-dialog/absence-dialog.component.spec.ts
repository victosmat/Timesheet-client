import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceDialogComponent } from './absence-dialog.component';

describe('AbsenceDialogComponent', () => {
  let component: AbsenceDialogComponent;
  let fixture: ComponentFixture<AbsenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsenceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
