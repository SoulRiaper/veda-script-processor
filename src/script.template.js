import {Model} from 'veda-client';

export const sql = '';
export const vql = "'rdf:type' == 'v-s:Person' && '@'  == 'cfg:Administrator'";
export const queryToQueryDelay = 1000;
export const urlToUrlDelay = 100;
export const globalLimit = 100;
export const limitPerCall = 100;
export const offset = 0;

export async function script (url) {
  try {
    const doc = new Model(url);
    await doc.load();
    doc.isSync(false);
    await doc.save();

    log.info('ok:', doc.id);
  } catch (e) {
    log.error(e.message);
    throw e;
  }
}
