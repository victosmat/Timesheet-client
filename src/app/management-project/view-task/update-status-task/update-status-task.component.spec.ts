import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusTaskComponent } from './update-status-task.component';

describe('UpdateStatusTaskComponent', () => {
  let component: UpdateStatusTaskComponent;
  let fixture: ComponentFixture<UpdateStatusTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStatusTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStatusTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
