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
* [Debugging your plugin](#debugging-your-plugin)
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
* [`sfdx changeset:retrieve -c <string> [-m source|mdapi] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-changesetretrieve--c-string--m-sourcemdapi--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `sfdx changeset:retrieve -c <string> [-m source|mdapi] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

Download a changeset to the project

```
USAGE
  $ sfdx changeset:retrieve -c <string> [-m source|mdapi] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal]

OPTIONS
  -c, --changesetname=changesetname               (required) name of changeset to retrieve

  -m, --mode=(source|mdapi)                       [default: mdapi] source re-retrieves the package with source:retrieve,
                                                  mdapi converts the package with mdapi:convert

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
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `changeset:retrieve` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx changeset:retrieve -u myOrg@example.com -c "My Changeset Name" --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run changeset:retrieve -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
