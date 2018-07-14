'use strict';

import * as configFile from './index';

describe('Config test', () => {
  it("Instance should be an object", () => {
    expect(configFile).toEqual(jasmine.any(Object));
  });
  
  it("Instance obj should have a discord library", () => {
    expect(configFile.discord).not.toBeUndefined()
  });
  
  it("Instance obj should have a defined discordClientSettings obj key", () => {
    expect(configFile.discordClientSettings).toBeUndefined()
  });
  
  it("Instance obj should have a defined giphySettings obj key", () => {
    expect(configFile.giphySettings).not.toBeUndefined()
  });
  
});