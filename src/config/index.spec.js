'use strict';

import * as configFile from './index';

describe('Config test', () => {
  it("should be an object", () => {
    expect(configFile).toEqual(jasmine.any(Object));
  });
  
});