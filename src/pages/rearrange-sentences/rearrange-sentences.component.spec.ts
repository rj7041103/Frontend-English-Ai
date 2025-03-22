import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearrangeSentencesComponent } from './rearrange-sentences.component';

describe('RearrangeSentencesComponent', () => {
  let component: RearrangeSentencesComponent;
  let fixture: ComponentFixture<RearrangeSentencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RearrangeSentencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RearrangeSentencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
