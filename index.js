/* global require, process, __dirname */
/* eslint no-console: off */
const express = require('express')
const next = require('next')
const axios = require('axios')
const favicon = require('serve-favicon')
const path = require('path')
const nodeHtmlToImage = require('node-html-to-image')
const puppeteer = require('puppeteer')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 3100

const dev = process.env.NODE_ENV === 'development'
if (dev === true) {
  process.env.MEASUREMENTS_URL = process.env.MEASUREMENTS_URL || 'http://127.0.0.1:' + process.env.PORT
} else {
  process.env.MEASUREMENTS_URL = process.env.MEASUREMENTS_URL || 'https://api.ooni.io'
}
if (!process.env.EXPLORER_URL) {
  process.env.EXPLORER_URL = 'http://127.0.0.1:' + process.env.PORT
}

const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()

const server = express()

const sourcemapsForSentryOnly = token => (req, res, next) => {
  // In production we only want to serve source maps for sentry
  if (!dev && !!token && req.headers['x-sentry-token'] !== token) {
    res
      .status(401)
      .send('Authentication access token is required to access the source map.')
    return
  }
  next()
}

app.prepare()
  .then(() => {
    return new Promise((resolve) => {
    // XXX in here I can do setup
      return resolve()
    })
  })
  .then(() => {
    server.use(favicon(path.join(__dirname, 'static', 'images', 'favicons', 'favicon.ico')))

    const { Sentry } = require('./utils/sentry')(app.buildId)
    // This attaches request information to sentry errors
    server.use(Sentry.Handlers.requestHandler())
    server.get(/\.map$/, sourcemapsForSentryOnly(process.env.SENTRY_TOKEN))

    server.get('/country/:countryCode', (req, res) => {
      return app.render(req, res, '/country', req.params)
    })

    server.get('/measurement/:report_id', (req, res) => {
      const combinedQuery = {...req.params, ...req.query}
      return app.render(req, res, '/measurement', combinedQuery)
    })
    
    server.get('/screenshot/measurement/:report_id', async (req, res) => {
      const combinedQuery = {screenshot: true, ...req.params, ...req.query}
      const result = await app.renderToHTML(req, res, '/measurement', combinedQuery)
      
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      await page.setContent(result)
      const element = await page.$('body')
      const buffer = await element.screenshot()
      // await browser.close()

      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.end(buffer, 'binary')
    })

    // Default catch all
    server.all('*', (req, res) => {
      return handle(req, res)
    })

    // This handles errors if they are thrown before raching the app
    server.use(Sentry.Handlers.errorHandler())

    server.listen(process.env.PORT, err => {
      if (err) {
        throw err
      }
      console.log('> Ready on http://localhost:' +
    process.env.PORT +
    ' [' + process.env.NODE_ENV + ']')
    })
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })
