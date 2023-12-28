import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBonusDialogComponent } from './edit-bonus-dialog.component';

describe('EditBonusDialogComponent', () => {
  let component: EditBonusDialogComponent;
  let fixture: ComponentFixture<EditBonusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBonusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBonusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
