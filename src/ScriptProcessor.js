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

  /**
 * Обрабатывает запрос к URL
 *
 * @param {String} queryStr - строка запроса, которая будет использоваться для получения URL.
 * @param {Number} queryToQueryDelay - задержка (в миллисекундах) между отдельными запросами к исходному серверу, чтобы предотвратить его перегрузку.
 * @param {Number} urlToUrlDelay - задержка (в миллисекундах) между обработками каждой отдельной URL, чтобы предотвратить перенагрузку.
 * @param {Number} globalLimit - общее количество URL, которые нужно обработать. Как только это количество достигнуто, функция прекращает выполнение.
 * @param {Number} limitPerCall - количество URL, которые могут быть обработаны за один вызов функции. Это полезно, если есть ограничения на количество одновременных запросов или ограничения скорости на стороне сервера.
 * @param {Number} offset - номер строки, с которой начинать поиск. Указывает, с какой строки функция должна начать обработку URL.
 */

  async processQuery (sql, vql, queryToQueryDelay, urlToUrlDelay, globalLimit, limitPerCall, from) {
    let totalProcessed = 0;
    let offset = from ? from : 0;

    while (totalProcessed < globalLimit) {
      const limit = Math.min(globalLimit - totalProcessed, limitPerCall);
      const queryResult = await this.veda.query(sql, vql, limit, offset);
      const urls = queryResult.result;
      log.info(urls);
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
