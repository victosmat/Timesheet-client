import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBonusToUserDialogComponent } from './save-bonus-to-user-dialog.component';

describe('SaveBonusToUserDialogComponent', () => {
  let component: SaveBonusToUserDialogComponent;
  let fixture: ComponentFixture<SaveBonusToUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveBonusToUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveBonusToUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
