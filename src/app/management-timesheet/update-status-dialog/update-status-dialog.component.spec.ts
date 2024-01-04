import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusDialogComponent } from './update-status-dialog.component';

describe('UpdateStatusDialogComponent', () => {
  let component: UpdateStatusDialogComponent;
  let fixture: ComponentFixture<UpdateStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStatusDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
