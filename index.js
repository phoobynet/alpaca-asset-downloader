const axios = require('axios')
const path = require('path')
const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv))
  .check((argv, options) => {
    /** @type {string|undefined} */
    const outfile = argv.outfile
    if (!outfile) {
      throw new Error('outfile arg required')
    }

    const dirname = path.dirname(outfile)

    if (dirname !== '.' && !fs.existsSync(dirname)) {
      throw new Error(`Path "${dirname}" does not exit`)
    } else {
      return true
    }
  })
  .describe('tradable', 'asset tradable or not')
  .describe('shortable', 'asset shortable or not')
  .describe('easy_to_borrow', 'asset easy_to_borrow or not')
  .describe('marginable', 'asset marginable or not')
  .describe('fractionable', 'asset fractionable or not')
  .describe('outfile', 'full path to output file')
  .alias('o', 'outfile')
  .requiresArg(['o'])
  .alias('s', 'status')
  .describe('s', 'the assets current status')
  .choices('s', ['active', 'active'])
  .coerce({
    tradable: coerceToBoolean,
    shortable: coerceToBoolean,
    marginable: coerceToBoolean,
    easy_to_borrow: coerceToBoolean,
    fractionable: coerceToBoolean,
  }).argv

const filters = [
  'tradable',
  'marginable',
  'shortable',
  'fractionable',
  'easy_to_borrow',
]

/** @typedef {object} Asset
 * @property {string} id
 * @property {string} class
 * @property {string} exchange
 * @property {string} symbol
 * @property {string} name
 * @property {string} status
 * @property {boolean} tradable
 * @property {boolean} marginable
 * @property {boolean} shortable
 * @property {boolean} easy_to_borrow
 * @property {boolean} fractionable
 */

async function main() {
  const { outfile, status, exchange, asset_class } = argv

  const queryParams = {
    status,
    exchange,
    asset_class,
  }

  const r = await axios.get('https://paper-api.alpaca.markets/v2/assets', {
    params: queryParams,
    headers: {
      'APCA-API-KEY-ID': process.env.APCA_API_KEY_ID,
      'APCA-API-SECRET-KEY': process.env.APCA_API_SECRET_KEY,
    },
  })

  if (r.status !== 200) {
    throw new Error(`${r.status} - ${r.statusText}: ${r.data}`)
  }

  /** @type {Asset[]}*/
  let assets = r.data

  for (const filter of filters) {
    if (filter in argv) {
      assets = assets.filter((asset) => asset[filter] === argv[filter])
    }
  }

  fs.writeFileSync(outfile, JSON.stringify(assets, null, 2), {
    encoding: 'utf-8',
    flag: 'w',
  })

  console.log(`Successfully downloaded ${assets.length} assets`)
}

main().catch((e) => {
  console.error(e)
})

function coerceToBoolean(value) {
  if (value === 'false') {
    return false
  } else if (value === 'true') {
    return true
  }

  return value
}
