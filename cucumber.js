module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['test/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'json:reports/cucumber-report.json', 
      'html:reports/cucumber-report.html'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  }
};