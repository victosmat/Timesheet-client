import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInfoDialogComponent } from './change-info-dialog.component';

describe('ChangeInfoDialogComponent', () => {
  let component: ChangeInfoDialogComponent;
  let fixture: ComponentFixture<ChangeInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
