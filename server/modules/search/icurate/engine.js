const icurate = require('../../../helpers/icurate')

module.exports = {
  activate() {
    // not used
  },
  deactivate() {
    // not used
  },
  /**
   * INIT
   */
  init() {
    // not used
  },
  /**
   * QUERY
   *
   * @param {String} q Query
   * @param {Object} opts Additional options
   */
  async query(q, opts) {
    const results = await icurate.query(q, opts.user.icurate.c)

    return {results: results, suggestions: [], totalHits: results.length}
  },
  /**
   * CREATE
   *
   * @param {Object} page Page to create
   */
  async created(page, c) {
    icurate.curatePage(page, c)
  },
  /**
   * UPDATE
   *
   * @param {Object} page Page to update
   */
  async updated(page, c) {
    icurate.curatePage(page, c)
  },
  /**
   * DELETE
   *
   * @param {Object} page Page to delete
   */
  async deleted(page, c) {
    icurate.deletePage(page, c)
  },
  /**
   * RENAME
   *
   * @param {Object} page Page to rename
   */
  async renamed(page, c) {
    icurate.deletePage(page, c)
    page.path = page.destinationPath
    icurate.createPage(page, c)
  },
  /**
   * REBUILD INDEX
   */
  async rebuild() {
    console.log('Rebuilding index')
    // not used
  }
}
