import { GlobalErrorHandlerFilter } from './error-handler.filter';

describe('', () => {
  it('should be defined', () => {
    const errorFilter = new GlobalErrorHandlerFilter();
    expect(errorFilter).toBeDefined();
  });
});
