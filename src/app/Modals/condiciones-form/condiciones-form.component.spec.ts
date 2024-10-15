import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionesFormComponent } from './condiciones-form.component';

describe('CondicionesFormComponent', () => {
  let component: CondicionesFormComponent;
  let fixture: ComponentFixture<CondicionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondicionesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CondicionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
