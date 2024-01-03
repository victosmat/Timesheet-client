import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImageCheckinDialogComponent } from './view-image-checkin-dialog.component';

describe('ViewImageCheckinDialogComponent', () => {
  let component: ViewImageCheckinDialogComponent;
  let fixture: ComponentFixture<ViewImageCheckinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewImageCheckinDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewImageCheckinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
