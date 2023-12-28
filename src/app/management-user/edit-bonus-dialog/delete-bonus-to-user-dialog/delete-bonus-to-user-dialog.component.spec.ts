import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBonusToUserDialogComponent } from './delete-bonus-to-user-dialog.component';

describe('DeleteBonusToUserDialogComponent', () => {
  let component: DeleteBonusToUserDialogComponent;
  let fixture: ComponentFixture<DeleteBonusToUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBonusToUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBonusToUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
