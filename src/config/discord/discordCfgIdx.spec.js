'use strict';

const {EventEmitter} = require('events');
import * as discordFile from './index';

describe('Discord Config test', () => {
  
  it("Discord connect const should be a function", () => {
    expect(discordFile.connect).toEqual(jasmine.any(Function));
  });
  
  
  describe('Check discord login', () => {
    let options, client, spyA, mediatorObj;
    beforeEach(() => {
      mediatorObj = new EventEmitter;
      spyA = jasmine.createSpy('A');
    });
    
    it("should fail to login if client key is no accepted from discord", (done) => {
      options = {
        discordClientId: 'asdf'
      };
      client = discordFile.connect(options, mediatorObj);
      mediatorObj.on('boot.ready', spyA);
      mediatorObj.emit('boot.ready');
      expect(spyA).toHaveBeenCalled();
      
      mediatorObj.on('discord.error', (result) => {
        done();
      });
    });

    it("should fail when no client key is provided", (done) => {
      options = {
        discordClientId: false // set to null to simulate a bad value
      };
      mediatorObj.on('discord.error', (result) => {
        expect(result).toEqual('Client ID not found!');
        done();
      });

      client = discordFile.connect(options, mediatorObj);
      mediatorObj.on('boot.ready', spyA);
      mediatorObj.emit('boot.ready');
      expect(spyA).toHaveBeenCalled();

    });

    // BELOW NOT POSSIBLE WITHOUT DI 
    // it("Login should succeed with mock", (done) => {
    //   mediatorObj.on('boot.ready', spyA);
    //   mediatorObj.emit('boot.ready');
    //   expect(spyA).toHaveBeenCalled();

    //   mediatorObj.on('discord.ready', (result) => {
    //     done();
    //   });

    // });

  });
});