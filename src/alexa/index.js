'use strict';

const alexaController = (mediator, something) => {
  
  return Object.create({

  });
};
  


const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(alexaController(mediator, connection));
  });
}

export {connect};