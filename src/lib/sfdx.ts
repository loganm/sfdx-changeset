import { SfdxError } from '@salesforce/core';
import { Dictionary, get } from '@salesforce/ts-types';
import { spawn, SpawnOptions } from 'child_process';

export const runCommand = (fullCommand: string): Promise<Dictionary> => {
  const error = new Error(); // Get stack here to use for later

  if (!fullCommand.includes('--json')) {
    fullCommand += ' --json';
  }

  //const parts = fullCommand.split(' ');

  // Split string, handle quote marks
  // https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
  const parts = fullCommand.match(/\\?.|^$/g).reduce((p, c) => {
    if(c === '"'){
        p.quote ^= 1;
    }else if(!p.quote && c === ' '){
        p.a.push('');
    }else{
        p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
    }
    return  p;
  }, {a: ['']}).a

  const commandName = parts[0];
  const args = parts.slice(1);

  const spawnOpt: SpawnOptions = {
    // Always use json in stdout
    env: Object.assign({ SFDX_JSON_TO_STDOUT: 'true' }, process.env)
  };

  return new Promise((resolve, reject) => {
    const cmd = spawn(commandName, args, spawnOpt);
    let stdout = '';
    cmd.stdout.on('data', data => {
      stdout += data;
    });

    cmd.stderr.on('data', data => {
      console.warn('srderr', data);
    });

    cmd.on('error', data => {
      console.error('err', data);
    });

    cmd.on('close', code => {
      let json;
      try { json = JSON.parse(stdout); } catch (e) {
        console.warn(`No parsable results from command "${fullCommand}"`);
      }
      if (code > 0) {
        // Get non-promise stack for extra help
        const sfdxError = SfdxError.wrap(error);
        sfdxError.message = `Command ${commandName} failed with ${get(json, 'message')}`;
        sfdxError.setData(json);
        reject(sfdxError);
      } else {
        resolve(json.result);
      }
    });
  });
};