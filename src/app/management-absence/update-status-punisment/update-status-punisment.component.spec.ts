import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusPunismentComponent } from './update-status-punisment.component';

describe('UpdateStatusPunismentComponent', () => {
  let component: UpdateStatusPunismentComponent;
  let fixture: ComponentFixture<UpdateStatusPunismentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStatusPunismentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStatusPunismentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
