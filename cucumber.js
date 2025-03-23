module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['test/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress']
  }
};