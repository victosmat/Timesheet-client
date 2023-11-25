import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIsDeletedComponent } from './update-is-deleted.component';

describe('UpdateIsDeletedComponent', () => {
  let component: UpdateIsDeletedComponent;
  let fixture: ComponentFixture<UpdateIsDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateIsDeletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateIsDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
