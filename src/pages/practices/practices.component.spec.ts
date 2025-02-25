import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticesComponent } from './practices.component';

describe('PracticesComponent', () => {
  let component: PracticesComponent;
  let fixture: ComponentFixture<PracticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
