import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IAComponent } from './ia.component';

describe('IAComponent', () => {
  let component: IAComponent;
  let fixture: ComponentFixture<IAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
