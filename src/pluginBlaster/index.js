'use strict';
import fs from 'fs';
import path from 'path';
import plugin from './pluginLoader';

const pluginController = (mediator, connectionsContainer, bootstrapContainer) => {
  const logger = bootstrapContainer.resolve('logger');
  let plugins = [];

  // loadPlugins is sync on purpose!
  const loadPlugins = () => {
    return new Promise((resolve, reject) => {
      const files = fs.readdirSync(path.join(__dirname, '../assets/plugins'));
      for(let i in files) {
        const pluginPath = path.join(__dirname, '../assets/plugins/', files[i]);
        const data = fs.readFileSync(path.join(pluginPath, '/manifest.json'), 'utf8');
        let obj = JSON.parse(data);
        const temp = plugin(obj, pluginPath);
        plugins.push(temp);
        logger.warn(`** Plugin ${temp.name} loaded at v${temp.version} by ${temp.author}`);
      }
      resolve();
    });
  };

  const getPlugins = () => {
    return plugins;
  };

  return Object.create({
    loadPlugins,
    getPlugins
  });
};


const connect = (mediator, connectionsContainer, bootstrapContainer) => {
  return new Promise((resolve, reject) => {
    resolve(pluginController(mediator, connectionsContainer, bootstrapContainer));
  });
};

export {connect};