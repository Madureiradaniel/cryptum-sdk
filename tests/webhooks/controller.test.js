const assert = require('assert')
const nock = require('nock')

const WebhookCryptum = require('../../src/features/webhooks/entity')
const WebhookCryptumController = require('../../src/features/webhooks/controller')

describe.only('Test Suite of the Webhook (Controller)', function () {
  this.beforeAll(() => {
    const postResponse = {
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
    }

    const getResponse = [
      {
        id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
        event: 'tx-confirmation',
        url: 'https://site.com',
        address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
        confirmations: 6,
      },
    ]

    nock('https://api-dev.cryptum.io', {
      reqheaders: { 'x-api-key': 'apikeyexamplecryptum' },
    })
      .post('/webhook/BTC', {
        asset: 'BTC',
        url: 'https://site.com',
        event: 'tx-confirmation',
        address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
        confirmations: '6',
        protocol: 'BITCOIN',
      })
      .reply(200, postResponse)

    const params = new URLSearchParams({ protocol: 'BITCOIN' })
    nock('https://api-dev.cryptum.io', {
      reqheaders: { 'x-api-key': 'apikeyexamplecryptum' },
    })
      .get('/webhook/BTC')
      .query(params)
      .reply(200, getResponse)

    nock('https://api-dev.cryptum.io', {
      reqheaders: { 'x-api-key': 'apikeyexamplecryptum' },
    })
      .delete('/webhook/BTC/143c07af-cc73-4d46-9e0a-8d96624a082e')
      .query(params)
      .reply(200)
  })

  it('Check create an webhook with WebhookCryptum valid : createWebhook', async () => {
    const data = {
      asset: 'BTC',
      url: 'https://site.com',
      event: 'tx-confirmation',
      address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
      confirmations: '6',
      protocol: 'BITCOIN',
    }

    const webhook = new WebhookCryptum(data)
    const expectedResult = new WebhookCryptum({
      ...webhook,
      id: '143c07af-cc73-4d46-9e0a-8d96624a082e',
    })

    const controller = new WebhookCryptumController({
      environment: 'development',
      apiKey: 'apikeyexamplecryptum',
    })
    const result = await controller.createWebhook(webhook)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check destroy an webhook with WebhookCryptum valid : destroyWebhook', async () => {
    const expectedResult = ''
    const data = {
      webhookId: '143c07af-cc73-4d46-9e0a-8d96624a082e',
      asset: 'BTC',
      protocol: 'BITCOIN',
    }

    const controller = new WebhookCryptumController({
      environment: 'development',
      apiKey: 'apikeyexamplecryptum',
    })
    const result = await controller.destroyWebhook(data)
    assert.deepStrictEqual(result, expectedResult)
  })

  it('Check get webhooks : getWebhooks', async () => {
    const expectedResult = [
      new WebhookCryptum({
        id: '68c2e098-12e0-435e-aabe-f2ed5a581672',
        event: 'tx-confirmation',
        url: 'https://site.com',
        address: '0x0c99adab65a55df5faf53ab923f43d9eb9368772',
        confirmations: 6,
      }),
    ]

    const controller = new WebhookCryptumController({
      environment: 'development',
      apiKey: 'apikeyexamplecryptum',
    })
    const result = await controller.getWebhooks('BTC', 'BITCOIN')
    assert.deepStrictEqual(result, expectedResult)
  })
})
