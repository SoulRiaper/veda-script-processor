import options from '../conf/options.js';
import ScriptProcessor from './ScriptProcessor.js';
import {script, sql, vql, queryToQueryDelay, urlToUrlDelay, globalLimit, limitPerCall, offset} from './script.js';


async function run () {
  const app = new ScriptProcessor(options, script);
  await app.init();
  await app.processQuery(sql, vql, queryToQueryDelay, urlToUrlDelay, globalLimit, limitPerCall, offset);
}

await run();
process.exit(0);
