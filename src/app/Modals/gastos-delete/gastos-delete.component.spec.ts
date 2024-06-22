import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosDeleteComponent } from './gastos-delete.component';

describe('GastosDeleteComponent', () => {
  let component: GastosDeleteComponent;
  let fixture: ComponentFixture<GastosDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GastosDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
