expect = require('chai').expect
compAppVer = require('../compare_app_versions')

describe 'Compare application versions test', ->

  it 'should throw Error if data is not correct', ->
    expect(() -> compAppVer.compareAppVersions('', '')).to.throw 'Wrong input data format.'
    expect(() -> compAppVer.compareAppVersions('a1.2.3a', 'a1.2.3a')).to.throw 'Wrong input data format.'
    expect(() -> compAppVer.compareAppVersions('a.b.c', 'a.b.c')).to.throw 'Wrong input data format.'

  it 'should return 0 if versions are equal', ->

    expect(compAppVer.compareAppVersions('1.1.1', '1.1.1')).to.equal 0
    expect(compAppVer.compareAppVersions('1', '1')).to.equal 0
    expect(compAppVer.compareAppVersions('1.1', '1.1')).to.equal 0

    expect(compAppVer.compareAppVersions('1.0', '1')).to.equal 0
    expect(compAppVer.compareAppVersions('1.1', '1.1.0')).to.equal 0
    expect(compAppVer.compareAppVersions('1.0.0', '1')).to.equal 0
    expect(compAppVer.compareAppVersions('1.0.0', '1.0')).to.equal 0

  it 'should return -1 if the first version is lower', ->

    expect(compAppVer.compareAppVersions('1.2.0', '1.2.3')).to.equal -1
    expect(compAppVer.compareAppVersions('1.1.0', '1.2.3')).to.equal -1
    expect(compAppVer.compareAppVersions('1.0.0', '1.2.3')).to.equal -1

    expect(compAppVer.compareAppVersions('1.2', '1.2.3')).to.equal -1
    expect(compAppVer.compareAppVersions('1.1', '1.2.3')).to.equal -1
    expect(compAppVer.compareAppVersions('1', '1.2.3')).to.equal -1

    expect(compAppVer.compareAppVersions('1.2.0', '1.3')).to.equal -1
    expect(compAppVer.compareAppVersions('1.0.0', '2')).to.equal -1

  it 'should return 1 if the second version is lower', ->

    expect(compAppVer.compareAppVersions('1.2.3', '1.2.0')).to.equal 1
    expect(compAppVer.compareAppVersions('1.2.3', '1.1.0')).to.equal 1
    expect(compAppVer.compareAppVersions('1.2.3', '1.0.0')).to.equal 1

    expect(compAppVer.compareAppVersions('1.2.3', '1.2')).to.equal 1
    expect(compAppVer.compareAppVersions('1.2.3', '1.1')).to.equal 1
    expect(compAppVer.compareAppVersions('1.2.3', '1')).to.equal 1

    expect(compAppVer.compareAppVersions('1.3', '1.2.0')).to.equal 1
    expect(compAppVer.compareAppVersions('2', '1.0.0')).to.equal 1
