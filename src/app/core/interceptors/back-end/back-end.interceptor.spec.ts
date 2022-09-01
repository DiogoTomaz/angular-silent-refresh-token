import { TestBed } from '@angular/core/testing';
import { BackEndInterceptor } from './back-end.interceptor';

describe('LoginInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
        BackEndInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BackEndInterceptor = TestBed.inject(BackEndInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
