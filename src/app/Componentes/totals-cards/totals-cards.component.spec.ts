import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsCardsComponent } from './totals-cards.component';

describe('TotalsCardsComponent', () => {
  let component: TotalsCardsComponent;
  let fixture: ComponentFixture<TotalsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalsCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
