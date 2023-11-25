import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementTardinessComponent } from './management-tardiness.component';

describe('ManagementTardinessComponent', () => {
  let component: ManagementTardinessComponent;
  let fixture: ComponentFixture<ManagementTardinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementTardinessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementTardinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
