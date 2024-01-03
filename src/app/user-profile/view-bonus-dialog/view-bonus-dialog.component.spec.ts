import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBonusDialogComponent } from './view-bonus-dialog.component';

describe('ViewBonusDialogComponent', () => {
  let component: ViewBonusDialogComponent;
  let fixture: ComponentFixture<ViewBonusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBonusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBonusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
