const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const vueBabelDir = path.resolve(
  __dirname,
  'node_modules/@vue/babel-preset-app/node_modules/@babel'
);
if (!fs.existsSync(vueBabelDir)) {
  console.log('lost "@vue/babel-preset-app/node_modules/@babel"! Install...');
  try {
    execSync('cd node_modules/@vue/babel-preset-app && npm i');
  } catch (ex) {
    console.log(ex);
  } finally {
    console.log('installed!');
  }
}
