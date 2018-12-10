module.exports = [
  {
    name: 'ui-framework',
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
  }
]
