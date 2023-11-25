import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainDialogComponent } from './complain-dialog.component';

describe('ComplainDialogComponent', () => {
  let component: ComplainDialogComponent;
  let fixture: ComponentFixture<ComplainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplainDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
