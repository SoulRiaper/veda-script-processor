import log from './log.js';
import VedaService from './VedaService.js';

export default class ScriptProcessor {
  constructor (vedaOptions, script) {
    this.veda = new VedaService(vedaOptions);
    this.script = script;
  }

  async init () {
    await this.veda.init();
  }

  async processUrl (urls, processFunc, delay) {
    for (const url of urls) {
      try {
        await processFunc(url);
      } catch (error) {
        log.error(`Произошла ошибка при обработке: ${url}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  async processQuery (queryString, queryToQueryDelay, urlToUrlDelay, globalLimit, limitPerCall, from) {
    let totalProcessed = 0;
    let offset = from ? from : 0;

    while (totalProcessed < globalLimit) {
      const limit = Math.min(globalLimit - totalProcessed, limitPerCall);
      const queryResult = await this.veda.query(queryString, limit, offset);
      const urls = queryResult.result;
      if (urls.length == 0) {
        log.info(`Query end, stop on ${limit}`);
        return;
      }

      await this.processUrl(urls, this.script, urlToUrlDelay);
      totalProcessed += limit;
      offset += limit;
      log.info(`Обработано ${totalProcessed} из ${globalLimit}`);
      await new Promise((resolve) => setTimeout(resolve, queryToQueryDelay));
    }
  }
}
