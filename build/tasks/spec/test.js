import Jasmine from 'jasmine';

let jasmine = new Jasmine();
jasmine.loadConfigFile('./build/templates/spec/jasmine.json');
jasmine.execute();