import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCheckinDialogComponent } from './confirm-checkin-dialog.component';

describe('ConfirmCheckinDialogComponent', () => {
  let component: ConfirmCheckinDialogComponent;
  let fixture: ComponentFixture<ConfirmCheckinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCheckinDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCheckinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
