# Cognito blueprint
Creates a Cognito User Pool, Cognito Application and an API Gateway backed by a Lambda proxy integration with Cognito Authorizer


### Build
```shell
sam build --use-container
```

### Deploy
```shell
sam deploy --s3-bucket <s3_bucket>
```

### Clean
```shell
sam delete 
```