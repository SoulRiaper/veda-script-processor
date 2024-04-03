import options from '../conf/options.js';
import log from './log.js';
import ScriptProcessor from './ScriptProcessor.js';
import {BaseModel} from 'veda-client';

const queryStr = 'SELECT DISTINCT msaa.id , msaa.v_s_deleted_int  from veda_tt."mnd-s:AdditionalAgreement" msaa WHERE msaa.v_s_deleted_int = [0] ORDER BY msaa.v_s_created_date ';
const queryToQueryDelay = 1000;
const urlToUrlDelay = 10;
const globalLimit = 10000;
const offset = 0;

async function script (url) {
  try {
    const doc = await new BaseModel(url).load();
    if (doc.hasValue('rdf:type', 'mnd-s:AdditionalAgreement') && typeof doc['v-s:registrationNumberAdd'][0] !== 'string' ) {
      const number = doc['v-s:registrationNumberAdd'][0].toString();

      doc['v-s:registrationNumberAdd'] = [number];
      log.info('switch addNum type: ', doc['v-s:registrationNumberAdd']);
    }
    doc['v-s:owner'] = [];
    doc['rdfs:label'] = doc['rdfs:label'][0] + ' ';
    doc.save();

    log.info('ok:', doc.id);
  } catch (e) {
    log.error(e.message);
    throw e;
  }
}

async function run () {
  const app = new ScriptProcessor(options, script);
  await app.init();
  await app.processQuery(queryStr, queryToQueryDelay, urlToUrlDelay, globalLimit, 10, offset);
}

await run();
process.exit(0);
