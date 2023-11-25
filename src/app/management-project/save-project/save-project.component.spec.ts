import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveProjectComponent } from './save-project.component';

describe('SaveProjectComponent', () => {
  let component: SaveProjectComponent;
  let fixture: ComponentFixture<SaveProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
