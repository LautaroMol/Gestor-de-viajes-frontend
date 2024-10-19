import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadModFormComponent } from './unidad-mod-form.component';

describe('UnidadModFormComponent', () => {
  let component: UnidadModFormComponent;
  let fixture: ComponentFixture<UnidadModFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadModFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadModFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
