# BecauseNPM Backend

## Similar Projects

- slant, in a way
- npmcompare.com
- search npm: https://api-docs.npms.io/
- https://libraries.io/npm/serverless-offline-sqs/1.5.0
  - has subscribe to package option!

## Local Development

[LocalStack](https://github.com/localstack/localstack) is used for running local instances of AWS SQS, AWS S3 and ElasticSearch.

### Installing on macOS

I used the `pip install --user localstack` command to install LocalStack on macOS.
I had to add the Python2.7 Libary directory to the PATH environment variable,
by adding the following to my `.bash_profile` file:

```
export PATH="$HOME/Library/Python/2.7/bin:$PATH"
```

### Development on macOS

Open the following three console windows, running these commands in the same order:

1. `npm run localstack:start`
2. `npm run localstack:populate` then `npm run serverless:offline`
3. `npm run test:integration` or `npm run test`

Anytime that you restart localstack, you need to first run the `npm run localstack:populate` command before starting up serverless with `npm run serverless:offline`.

## TODO

- include popularity measure in node object.

// edge comment ids

tweet is immutable
metadata on tweet is not (deleted, not deleted)

delete tweet

- rewrite s3 object with status metadatum set to deleted
- use script to remove id from edge edgeCommentIds array
- remove edgeComment

### Autocomplete Changes

- Favour an exact match? e.g., `react` package is not top hit when term is 'react'
  // TODO check if react-router is found by terms 'react router' and 'reactrouter'

How to allow the term 'reactrouter' to find 'react-router'??
