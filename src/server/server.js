

const start = (options) => {
  return new Promise((resolve, reject) => {
    if (!options.soundRepo) { 
      reject(new Error('The server must have a connected soundRepo'));
    }
    
    //options.locateRepo.getMailAndParse(options);
    options.soundRepo.soundTriggerListner();
    options.soundRepo.soundProcessor();
    options.soundRepo.soundHalter();
    
    /*if (!options.port) {
      reject(new Error('The server must be started with an available port'));
    } */
    
    resolve("TEST");
    
    const server = resolve(server);
  });
}


export {start};