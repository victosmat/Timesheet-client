import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteImageCheckinDialogComponent } from './delete-image-checkin-dialog.component';

describe('DeleteImageCheckinDialogComponent', () => {
  let component: DeleteImageCheckinDialogComponent;
  let fixture: ComponentFixture<DeleteImageCheckinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteImageCheckinDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteImageCheckinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
