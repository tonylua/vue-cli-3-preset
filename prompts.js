module.exports = [
  {
    name: 'i18n',
    type: 'list',
    message: 'choose a I18n Framework',
    choices: [
      {
        name: 'none',
        value: 'none'
      },
      {
        name: 'Vue I18n',
        value: 'vue-i18n'
      }
    ],
    default: 'none'
  },
  {
    name: 'ui',
    type: 'list',
    message: 'choose a UI Framework',
    choices: [
      {
        name: 'none',
        value: 'none'
      },
      {
        name: 'Element UI',
        value: 'element-ui'
      }
    ],
    default: 'none'
  },
  {
    name: 'mock',
    type: 'list',
    message: 'choose a local mock server',
    choices: [
      {
        name: 'none',
        value: 'none'
      },
      {
        name: 'express.js',
        value: 'express.js'
      }
    ],
    default: 'none'
  },
  {
    name: 'storybook',
    type: 'confirm',
    message: 'use storybook?',
    default: true
  }
];
