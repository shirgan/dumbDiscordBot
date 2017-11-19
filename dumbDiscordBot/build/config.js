// meh, just export the whole dang thing as an object...

export default {
  config: {
    src: [
      'src/**/*.js',
      '!src/**/{fixtures,templates}/**'
    ],
    backEndsrc: [
      'src/**/*.js'
    ],
    backEndTemplates: [
      'src/**/*',
      '!src/**/*.js'
    ],
    templates: [
      //'src/**/{fixtures,templates}/**',
      //'src/**/*.json',
      //'src/**/*.php',
      //'src/**/*.html',
      //'src/**/*.png',
      //'src/**/*.xml',
      //'src/**/*.sql',
      //'src/**/*.py',
      //'src/**/*.sh',
      //'src/**/*.jpg',
      //'src/**/*.jpeg',
      //'src/**/*.ico',
      //'src/**/*.jpeg',
      //'src/**/*.csv',
      //'src/**/*.conf',
      //'src/**/*.css',
      //'src/**/*.sass',
      //'src/**/templates/**/.*'
    ],
    destDir: "dist",
    targetDir: "target"
  },
  test: {
    
  }
};
