# OCFR Calls

Converts Orange County Fire Rescue (Florida) call data into JSON

## Requirements

NodeJS > v11.13.0
yarn or npm


## Setup

```
yarn install
```


## Usage

```
node teshandler.js
```

JSON representation is printed to console


## Cloudflare Workers
Install and configure wrangler for your Cloudlare account https://developers.cloudflare.com/workers/tooling/wrangler/install/

Create a wrangler.toml with the appropriate account_id

```
# wrangler.toml

# The name of your Workers application
name = "ocfr-calls"

# Your Cloudflare account ID
account_id = "yourAccountId"

# The kind of application you're deploying to Cloudflare
type = "webpack"

# Publish to workers.dev by default
workers_dev = true
```

Then...

```
wrangler publish
```

Visit your worker's url and get your JSON!
