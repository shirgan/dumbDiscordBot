'use strict';

import * as configFile from './index';
import {createContainer, asValue} from 'awilix';

describe('Config test', () => {
   const testContainer = createContainer();
   const connectionsContainer = createContainer();

  it('Instance should be an object', () => {
    expect(configFile).toEqual(jasmine.any(Object));
  });
  
  // it('Instance obj should have a discord library', () => {
  //   expect(configFile.discord).not.toBeUndefined();
  // });
  
  // it('Instance obj should have a defined discordClientSettings obj key', () => {
  //   expect(configFile.discordClientSettings).not.toBeUndefined();
  // });
  
  // it('Instance obj should have a defined giphySettings obj key', () => {
  //   expect(configFile.giphySettings).not.toBeUndefined();
  // });
  
});