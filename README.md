# BecauseNPM Backend

## Similar Projects

- [Slant](https://www.slant.co/), in some ways
- [NPM Compare](npmcompare.com)
- [Search NPM](https://api-docs.npms.io/)
- [Libraries.io](https://libraries.io/npm)
  - has a 'subscribe to package' option

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

- Include popularity measure in node object.
- Delete tweet support
  - use script to remove id from edge edgeCommentIds array, if supported by search host
  - remove edgeComment

### Search Changes

- Searching for 'form' does not return 'formik', since the fuzziness distance is slightly more
  than that used for the search

### GraphQL changes

- All data support
