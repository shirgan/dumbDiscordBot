'use strict';

const soundController = (connection) => {
  const discord = connection;

  const soundTriggerListner = (options) => {
    //const {} = options;
    return new Promise((resolve, reject) => {
      reject("TEST ERROR");
    });
  };
  
  return Object.create({
    soundTriggerListner
  });
};


const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(soundController(connection));
  });
}

export {connect};