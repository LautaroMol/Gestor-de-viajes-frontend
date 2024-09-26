import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciaFormComponent } from './sugerencia-form.component';

describe('SugerenciaFormComponent', () => {
  let component: SugerenciaFormComponent;
  let fixture: ComponentFixture<SugerenciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugerenciaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugerenciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
