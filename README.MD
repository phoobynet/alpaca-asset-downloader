# Alpaca Asset Downloader

## Summary

Downloads Alpaca Asset information from
the [Alpaca Trade API](https://alpaca.markets/docs/api-references/trading-api/assets/).

You will require an [Alpaca account](https://app.alpaca.markets/signup) is use the service.

## Credentials

Add the following keys to your environement.

```bash
APCA_API_KEY_ID=<KEY>
APCA_API_SECRET_KEY=<SECRET>
```

## Usage

The only required argument is `-o` or it's alias `--outfile`.  All other args are optional.

```
node index.js -o assets.json --status=active --exchange=NASDAQ --asset_class=us_equity --shortable --fractionable=false --easy_to_borrow --marginable --tradable
```

