import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeDeleteComponent } from './viaje-delete.component';

describe('ViajeDeleteComponent', () => {
  let component: ViajeDeleteComponent;
  let fixture: ComponentFixture<ViajeDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajeDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViajeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
