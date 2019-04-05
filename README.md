sfdx-changeset
=========

An SFDX plugin that can retrieve components from a changeset into an org-based project

[![Version](https://img.shields.io/npm/v/sfdx-changeset.svg)](https://npmjs.org/package/sfdx-changeset)
[![CircleCI](https://circleci.com/gh/loganm/sfdx-changeset/tree/master.svg?style=shield)](https://circleci.com/gh/loganm/sfdx-changeset/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/loganm/sfdx-changeset?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-changeset/branch/master)
[![Codecov](https://codecov.io/gh/loganm/sfdx-changeset/branch/master/graph/badge.svg)](https://codecov.io/gh/loganm/sfdx-changeset)
[![Greenkeeper](https://badges.greenkeeper.io/loganm/sfdx-changeset.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/loganm/sfdx-changeset/badge.svg)](https://snyk.io/test/github/loganm/sfdx-changeset)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-changeset.svg)](https://npmjs.org/package/sfdx-changeset)
[![License](https://img.shields.io/npm/l/sfdx-changeset.svg)](https://github.com/loganm/sfdx-changeset/blob/master/package.json)

<!-- toc -->

<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-changeset
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-changeset/0.0.1 darwin-x64 node-v11.9.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx changeset:retrieve -c <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-changesetretrieve--c-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `sfdx changeset:retrieve -c <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

Download a changeset to the project

```
USAGE
  $ sfdx changeset:retrieve -c <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal]

OPTIONS
  -c, --changesetname=changesetname               (required) name of changeset to retrieve
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  [default: warn] logging level for this command invocation

EXAMPLE
  $ sfdx changeset:retrieve --targetusername myOrg@example.com --changeset "Name of Changeset"
     Retrieving Changeset... Done!
     Extracting Package... Done!
     Converting to Source... Done!
     Cleaning up temporary files... Done!
```

_See code: [src/commands/changeset/retrieve.ts](https://github.com/loganm/sfdx-changeset/blob/v0.0.1/src/commands/changeset/retrieve.ts)_
<!-- commandsstop -->
