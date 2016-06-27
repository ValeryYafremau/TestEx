module.exports.compareAppVersions = (ver1, ver2) ->

  SemVerFormatRegEx = /^(\d+\.)?(\d+\.)?(\d+)$/

  if !ver1.match(SemVerFormatRegEx) or !ver2.match(SemVerFormatRegEx)
    throw 'Wrong input data format.'

  version1 = ver1.trim().split('.')
  version2 = ver2.trim().split('.')

  for i in [0..2]

    buf1 = if +version1[i] then +version1[i] else 0
    buf2 = if +version2[i] then +version2[i] else 0

    if buf1 != buf2

      if buf1 < buf2

        return -1
      else
        return 1
  0
