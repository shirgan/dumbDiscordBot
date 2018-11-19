import fs from 'fs';
import path from 'path';

const pluginLoader = (data, pluginPath) => {
  let pluginObj = {
    name: 'unknown',
    version: '0.0.0',
    author: 'unknown',
    triggers: {
      image: [],
      sound: [],
    },
  };

  if (data.hasOwnProperty('name')) {
    pluginObj.name = data.name;
  }

  if (data.hasOwnProperty('version')) {
    pluginObj.version = data.version;
  }

  if (data.hasOwnProperty('name')) {
    pluginObj.author = data.author;
  }

  if (data.hasOwnProperty('soundTriggers')) {
    for(let i in data.soundTriggers) {
      const triggerObj = data.soundTriggers[i];
      if(triggerObj.hasOwnProperty('keyword') && triggerObj.hasOwnProperty('location')) {
        let fileArr = [];
        for(let j in triggerObj.location) {
          const files = fs.readdirSync(path.join(pluginPath, triggerObj.location[j]))
            .filter(file => {
                return path.extname(file).match('^(\.(wav|mp3))$');
            });
          for(let k in files) {
            fileArr.push(path.join(pluginPath, triggerObj.location[j], files[k]));
          }
        }
        pluginObj.triggers.sound.push({
          keyword: triggerObj.keyword,
          sounds: fileArr,
          curIndex: -1,
        });
      }
    }
    //pluginObj.triggers.sound.push()
  }


  return pluginObj;
};

export default pluginLoader;