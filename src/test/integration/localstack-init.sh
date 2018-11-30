aws --endpoint-url=http://localhost:4576 sqs create-queue --queue-name because-npm-tweet-created-development
aws --endpoint-url=http://localhost:4576 sqs create-queue --queue-name because-npm-tweet-created-development-dl

aws --endpoint-url=http://localhost:4576 sqs list-queues

curl -X PUT "localhost:4571/node" -H 'Content-Type: application/json' --data-binary "@./src/indexer/index-mappings/node-mapping.json"
curl -X PUT "localhost:4571/edge" -H 'Content-Type: application/json' --data-binary "@./src/indexer/index-mappings/edge-mapping.json"
curl -X PUT "localhost:4571/edge-comment" -H 'Content-Type: application/json' --data-binary "@./src/indexer/index-mappings/edge-comment-mapping.json"

curl -X GET "localhost:4571/_cat/indices?v"

aws --endpoint-url=http://localhost:4569 dynamodb create-table --table-name because-npm-tweet-development --attribute-definitions AttributeName=id,AttributeType=S AttributeName=timestampMs,AttributeType=N --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 --global-secondary-indexes "IndexName=because-npm-tweet-by-timestamp-development,KeySchema=[{AttributeName=timestampMs,KeyType=HASH}],Projection={ProjectionType=KEYS_ONLY},ProvisionedThroughput={ReadCapacityUnits=2,WriteCapacityUnits=2}"
aws --endpoint-url=http://localhost:4569 dynamodb list-tables
# aws --endpoint-url=http://localhost:4569 dynamodb describe-table --table-name because-npm-tweet-development

# aws --endpoint-url=http://localhost:4569 dynamodb delete-table --table-name because-npm-tweet-development

# aws --endpoint-url=http://localhost:4572 --profile=development --region=eu-west-1 s3api create-bucket --bucket because-npm-tweet-created-development
# aws --endpoint-url=http://localhost:4572 s3api create-bucket --profile development --bucket because-npm-failed-tweets-development --region development/eu-west-1

# aws --endpoint-url=http://localhost:4572 s3api list-buckets --profile development --query "Buckets[].Name" --region development/eu-west-1
