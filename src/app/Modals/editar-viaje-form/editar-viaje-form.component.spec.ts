import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarViajeFormComponent } from './editar-viaje-form.component';

describe('EditarViajeFormComponent', () => {
  let component: EditarViajeFormComponent;
  let fixture: ComponentFixture<EditarViajeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarViajeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarViajeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
