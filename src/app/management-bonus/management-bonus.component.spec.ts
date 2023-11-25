import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementBonusComponent } from './management-bonus.component';

describe('ManagementBonusComponent', () => {
  let component: ManagementBonusComponent;
  let fixture: ComponentFixture<ManagementBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementBonusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
