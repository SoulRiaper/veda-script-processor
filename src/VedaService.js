import {Backend} from 'veda-client';
import log from './log.js';

export default class VedaService {
  constructor (options) {
    this.options = options;
  }

  async init () {
    try {
      Backend.init(this.options.veda.server);
      const authInfo = await this.authenticate();
      log.info('Veda user authentication success:', this.options.veda.user);
      log.info('Ticket will expire at:', new Date(authInfo.expires).toISOString());
      setInterval(this.#refreshTicket.bind(this), (authInfo.expires - Date.now()) * 0.9);
    } catch (error) {
      log.error('Veda user authentication error:', error.message);
      log.debug(error);
      throw error;
    }
  }

  async #refreshTicket () {
    try {
      const authInfo = await this.authenticate();
      log.info('Veda ticket refreshed for user:', this.options.veda.user);
      log.info('Ticket will expire at:', new Date(authInfo.expires).toISOString());
    } catch (error) {
      console.error('Veda ticket refresh error:', error.message);
      log.error(error);
      await timeout();
      await this.#refreshTicket();
    }
  }

  async authenticate () {
    return await Backend.authenticate(this.options.veda.user, this.options.veda.password);
  }

  async query (sql, vql, limit, offset) {
    const queryParams = {
      from: offset,
      top: limit,
      limit: limit,
      sql: sql,
      query: vql,
    };
    if (!sql) {
      delete queryParams.sql;
    }
    if (!vql) {
      delete queryParams.query;
    }
    if (!sql && !vql) return [];
    return await Backend.query(queryParams);
  }
}
