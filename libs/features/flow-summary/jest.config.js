module.exports = {
  name: 'features-flow-summary',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/features/flow-summary',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
