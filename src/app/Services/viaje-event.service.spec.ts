import { TestBed } from '@angular/core/testing';

import { ViajeEventService } from './viaje-event.service';

describe('ViajeEventService', () => {
  let service: ViajeEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViajeEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
