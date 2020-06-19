module.exports = {
  name: 'daskalos',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/daskalos',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
