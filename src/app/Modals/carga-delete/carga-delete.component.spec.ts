import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaDeleteComponent } from './carga-delete.component';

describe('CargaDeleteComponent', () => {
  let component: CargaDeleteComponent;
  let fixture: ComponentFixture<CargaDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
