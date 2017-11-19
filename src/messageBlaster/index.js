'use strict';
import fs from 'fs';
import path from 'path';

const Subject = (mediator) => {
  let observers = [];

  return {
    subscribeObserver: function(observer, name) {
      observers.push(observer);
      mediator.emit('generic.log', "Observer registered "+name);
    },
    unsubscribeObserver: function(observer) {
      let index = observers.indexOf(observer);
      if(index > -1) {
        observers.splice(index, 1);
      }
    },
    notifyObserver: function(observer) {
      let index = observers.indexOf(observer);
      if(index > -1) {
        observers[index].notify(index);
      }
    },
    notifyAllObservers: function(message) {
      for(let i = 0; i < observers.length; i++){
        observers[i].notify(message);
      };
    }
  };
};

const messageController = (mediator, discordClient) => {
  
  var subject = new Subject(mediator);
  
  const messageRouter = (options) => {
    discordClient.on('message', message => {
      
      
      subject.notifyAllObservers(message);
      
      
    });
  };
  


  return Object.create({
    messageRouter,
    subject
  });
};

const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(messageController(mediator, connection));
  });
}



export {connect};