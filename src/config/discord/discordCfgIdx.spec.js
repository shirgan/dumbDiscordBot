// 'use strict';

// const {EventEmitter} = require('events');
// import * as discordFile from './index';

// describe('Discord Config test', () => {
//   let mediatorObj = new EventEmitter;
  
//   it("Discord connect const should be a function", () => {
//     expect(discordFile.connect).toEqual(jasmine.any(Function));
//   });
  
  
//   describe('Check discord login', () => {
//     let options, client, spyA;
//     beforeEach(() => {
//       options = {
//         discordClientId: "asdf"
//       };
//       spyA = jasmine.createSpy('A');
//       client = discordFile.connect(options, mediatorObj);
//     });
    
//     it("Login should fail to login if no valid key is provided", (done) => {
//       mediatorObj.on('boot.ready', spyA);
//       mediatorObj.emit('boot.ready');
//       expect(spyA).toHaveBeenCalled();
      
//       mediatorObj.on('discord.error', (result) => {
//         done();
//       });
//     });
    
//     //it("Login should succeed if a valid key is present", (done) => {
      
//     //});

//   });
// });