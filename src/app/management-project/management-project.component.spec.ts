import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementProjectComponent } from './management-project.component';

describe('ManagementProjectComponent', () => {
  let component: ManagementProjectComponent;
  let fixture: ComponentFixture<ManagementProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
