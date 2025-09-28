Nx CDK Plugin

A modular Nx plugin for defining and deploying AWS infrastructure using AWS CDK — supporting microservices, presets, environment-aware deploys, and one-command resource bundling.

Developer Command Reference

**Generator Commands**

Preset Generators (One Command: API + DB + Queues)

* `nx g @nx-cdk/preset event-service orders --env=dev`
* `nx g @nx-cdk/preset storage-service files --env=staging`
* `nx g @nx-cdk/preset worker-service billing --env=prod`
* `nx g @nx-cdk/preset custom-preset payments --env=dev`

Resource Bundle Generator (Multiple Resources at Once)

* `nx g @nx-cdk/resources orders --add=dynamodb,sns-sqs,s3`
* `nx g @nx-cdk/resources orders --add=s3`

Individual Resource Generators

* `nx g @nx-cdk/api-service orders`
* `nx g @nx-cdk/dynamodb orders`
* `nx g @nx-cdk/sns-sqs orders`
* `nx g @nx-cdk/s3 orders`
* `nx g @nx-cdk/cdk-config orders --env=dev`

**Build / Deploy / Destroy Commands**

Build Project

`nx build orders`

Deploy to Environment

* `nx deploy orders --env=dev`
* `nx deploy orders --env=staging`
* `nx deploy orders --env=prod`

Destroy Environment

* `nx destroy orders --env=dev`
* `nx destroy orders --env=staging`
* `nx destroy orders --env=prod`

Environment Context Files

* `apps/orders/infra/cdk.json`
* `apps/orders/infra/cdk.context.dev.json`
* `apps/orders/infra/cdk.context.staging.json`
* `apps/orders/infra/cdk.context.prod.json`

**Typical End-to-End Developer Workflow**

* Scaffold a service with preset infrastructure:
`nx g @nx-cdk/preset event-service orders --env=dev`

* Build Lambda/API and CDK code:
`nx build orders`

* Deploy stack to environment:
`nx deploy orders --env=dev`

* Add more resources later (optional):
`nx g @nx-cdk/resources orders --add=s3`
`nx deploy orders --env=dev`

* Tear down environment (for cleanup/testing):
`nx destroy orders --env=dev`

### Contributing

* Fork this repo
* Install dependencies
* Add a generator or executor
* Test with an Nx workspace
* Submit a PR!

### License

MIT — ©️ Muhammad Hamza Shahzad