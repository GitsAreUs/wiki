const _ = require('lodash')
const fetch = require('node-fetch')

const host = 'localhost'
const port = 9999

/* global WIKI */

module.exports = {
  async auth(user) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + user.token
    }

    const authReq = {query: `query{user_auth(email: "${user.email}")}`}
    const resp = await fetch(`http://${host}:${port}/graphql`, {
      method: 'post',
      headers: headers,
      body: JSON.stringify(authReq)
    })

    const jsonResp = await resp.text()

    let d = JSON.parse(jsonResp).data.user_auth
    d = JSON.parse(d)
    d = d.d
    const c = resp.headers.raw()['set-cookie']

    return {d: d, c: JSON.stringify(c)}
  },

  async query(q, c) {
    q = q !== '**' ? q : ''

    const t1 = Date.now()

    // TODO: Config item
    const response = await fetch(encodeURI(`http://${host}:${port}/graphql?query={match_url(search:"${q}"){id url title summary sha}}`), {
      method: 'get',
      headers: {
        'Cookie': c
      }
    })

    var bmrks = await response.text()

    bmrks = JSON.parse(bmrks)

    var results = []

    _.forEach(bmrks.data.match_url, bmrk => results.push({
      id: bmrk.sha,
      title: bmrk.title,
      description: bmrk.summary !== null ? bmrk.summary : 'No summary available.',
      path: bmrk.url,
      locale: 'en'
    }))

    return results
  },

  async curatePage(page, c) {
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': c
    }

    const curateContent = {query: `mutation{curate_content(url: "${'wiki://' + page.path}", title: "${page.title}", tags: "${page.tags}", summary: "${page.description}", content: "${page.safeContent}")}`}
    const resp = await fetch(`http://${host}:${port}/graphql`, {
      method: 'post',
      headers: headers,
      body: JSON.stringify(curateContent)
    })

    if (resp.status === 200) {
      console.log('Page safe content successfully submitted for curation')
    } else {
      console.log('Failed to curate page content.')
      console.log(resp.message())
    }
  },

  async deletePage(page, c) {
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': c
    }

    const curateContent = {query: `mutation{delete_bookmark(url: "${'wiki://' + page.path}")}`}
    const resp = await fetch(`http://${host}:${port}/graphql`, {
      method: 'post',
      headers: headers,
      body: JSON.stringify(curateContent)
    })

    if (resp.status === 200) {
      console.log('Page content successfully deleted.')
    } else {
      console.log('Failed to delete page.')
      console.log(resp.message())
    }
  }
}
