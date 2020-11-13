import { flags, SfdxCommand } from '@salesforce/command';
import { SfdxError, Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import * as AdmZip from 'adm-zip';
import * as del from 'del';
import { default as slugify } from 'slugify';
import { runCommand } from '../../lib/sfdx';
import { exec } from '../../lib/execProm';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-changeset', 'retrieve');

export default class Retrieve extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx changeset:retrieve --targetusername myOrg@example.com --changeset "Name of Changeset"
  Retrieving Changeset... Done!
  Extracting Package... Done!
  Converting to Source... Done!
  Cleaning up temporary files... Done!
  `,
  `$ sfdx changeset:retrieve --targetusername myOrg@example.com --changeset "Name of Changeset" -p
  Retrieving Changeset... Done!
  Extracting Package... Done!
  Converting to Source... Done!
  Saving manifest/changesets/Name-of-Changeset-package.xml... Done!
  Cleaning up temporary files... Done!
  `,
  `$ sfdx changeset:retrieve --targetusername myOrg@example.com --changeset "Name of Changeset" -n manifest/pack.xml
  Retrieving Changeset... Done!
  Extracting Package... Done!
  Converting to Source... Done!
  Saving manifest/pack.xml... Done!
  Cleaning up temporary files... Done!
  `
  ];

  public static args = [{name: 'file'}];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    changesetname: flags.string( {char: 'c', required: true,  description: messages.getMessage('changesetnameFlagDescription')})
    ,packagename:  flags.string( {char: 'n', required: false, description: messages.getMessage('packagenameFlagDescription'  )})
    ,savepackage:  flags.boolean({char: 'p', required: false, description: messages.getMessage('savepackageFlagDescription'  )})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    const username = this.org.getUsername();
    const changesetname = this.flags.changesetname;

    if (this.flags.packagename && this.flags.savepackage) {
      throw new SfdxError(messages.getMessage('packageFlagsError'));
    }

    const conn = this.org.getConnection();
    conn.metadata.pollTimeout = (10*60*1000); // 10 minutes

    this.ux.startSpinner('Retrieving Changeset');
    const pkgBuf = await this.retrieveChangeset(conn, changesetname);
    this.ux.stopSpinner('Done!');

    this.ux.startSpinner('Extracting package.xml');
    let zip = new AdmZip(pkgBuf);
    await zip.extractEntryTo(`${changesetname}/package.xml`, `changesets`, true, true);
    this.ux.stopSpinner('Done!');

    this.ux.startSpinner('Retrieving Source');
    await runCommand(`sfdx force:source:retrieve -u "${username}" -x "changesets/${changesetname}/package.xml"`);
    this.ux.stopSpinner('Done!');

    if (this.flags.packagename || this.flags.savepackage) {
      let packagefilename;
      if (this.flags.packagename) {
        packagefilename = `${ this.flags.packagename }`;
      } else {
        packagefilename = `manifest/changesets/${ slugify(changesetname).replace(':', '').trim() }-package.xml`;
        await exec(`mkdir -p ./manifest/changesets`);
      }
      this.ux.startSpinner(`Saving ${packagefilename}`);
      await exec(`cp -r ./changesets/*/package.xml ${packagefilename}`);
      this.ux.stopSpinner('Done!');
    }

    this.ux.startSpinner('Cleaning up temporary files');
    del.sync(['changesets']);
    this.ux.stopSpinner('Done!');

    return;
  }

  private retrieveChangeset(conn, changesetname) {
    
    return new Promise(function(resolve, reject) {
      var dataBuffer = [];

      // Must specify api version here, was defaulting to 13.0 otherwise
      conn.metadata.retrieve({ packageNames: [ changesetname ], apiVersion: conn.getApiVersion() })
        .stream()
        .on('data', function(chunk) {
          dataBuffer.push(chunk);
        })
        .on('end', function() {
          const data = Buffer.concat(dataBuffer);
          resolve(data);
        })
        .on('error', function(error) {
          reject(error);
        });
    });    
  }
}
