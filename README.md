# Nx CDK Plugin

[![npm version](https://img.shields.io/npm/v/nx-cdk-deploy)](https://www.npmjs.com/package/nx-cdk-deploy)  
[![build status](https://github.com/your-org/nx-cdk-deploy/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/nx-cdk-deploy/actions)  
[![license](https://img.shields.io/github/license/mhshahzad/nx-cdk-deploy)](LICENSE)

A powerful Nx plugin that seamlessly integrates AWS Cloud Development Kit (CDK) into your Nx monorepo. Build, deploy, and manage AWS infrastructure for microservices with reusable presets, modular resource bundles, and environment-aware configurations.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Available Presets](#available-presets)
- [Generators](#generators)
- [Executors](#executors)
- [Configuration](#configuration)
- [Environment Management](#environment-management)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## Features

✅ **Nx Integration** - Native support for Nx workspaces with caching and dependency management  
✅ **Preset Templates** - Pre-configured infrastructure patterns for common microservice architectures  
✅ **Modular Resources** - Add individual AWS services (SNS, SQS, DynamoDB, S3) as needed  
✅ **Environment Awareness** - Separate configurations for dev, staging, and production  
✅ **TypeScript First** - Full TypeScript support with type safety  
✅ **CI/CD Ready** - Designed for automated deployment pipelines  

---

## Installation

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate credentials
- Nx workspace (v16+)

### Install the Plugin

```bash
npm install --save-dev @nx-cdk-deploy/plugin aws-cdk-lib constructs
```

---

## Quick Start

Get up and running in minutes with a complete microservice deployment.

### 1. Generate Your First Service

Create an event-driven microservice with Lambda, API Gateway, DynamoDB, SNS, and SQS:

```shell script
nx g @nx-cdk-deploy/preset event-service orders --env=dev
```


### 2. Build and Deploy

```shell script
# Build the service
nx build orders

# Deploy to AWS
nx deploy orders --env=dev
```


### 3. Verify Deployment

Your service will be deployed with:
- Lambda function for business logic
- API Gateway for HTTP endpoints
- DynamoDB table for data storage
- SNS topic and SQS queue for messaging

### 4. Clean Up (Optional)

```shell script
nx destroy orders --env=dev
```


---

## Core Concepts

### Presets

**Presets** are pre-configured infrastructure templates that scaffold complete, production-ready microservice architectures. Each preset combines multiple AWS resources following best practices.

**Benefits:**
- Faster time to market
- Consistent architecture patterns
- Battle-tested configurations
- Easy customization

### Resource Bundles

**Resource Bundles** allow you to add specific AWS services to existing projects. Mix and match resources based on your needs.

**Available Resources:**
- `api-service` - Lambda + API Gateway
- `dynamodb` - DynamoDB tables with indexes
- `sns-sqs` - SNS topics with SQS subscriptions
- `s3` - S3 buckets with policies

### Environment Management

**Environment-aware configurations** ensure your infrastructure adapts to different deployment stages:

```
├── cdk.context.dev.json      # Development settings
├── cdk.context.staging.json  # Staging settings
└── cdk.context.prod.json     # Production settings
```


---

## Available Presets

| Preset | Description | Use Case | Resources |
|--------|-------------|----------|-----------|
| `event-service` | Event-driven microservice | Order processing, notifications | Lambda + API Gateway + DynamoDB + SNS + SQS |
| `storage-service` | File storage service | Document management, uploads | Lambda + API Gateway + S3 |
| `worker-service` | Background processing | Data processing, async tasks | Lambda + SQS + DynamoDB |
| `custom-preset` | Full-featured service | Complex applications | All resources included |

### Usage Example

```shell script
# Event-driven service for order processing
nx g @nx-cdk-deploy/preset event-service orders --env=dev

# Storage service for document management
nx g @nx-cdk-deploy/preset storage-service documents --env=dev

# Background worker for data processing
nx g @nx-cdk-deploy/preset worker-service data-processor --env=dev
```


---

## Generators

### Preset Generator

Generate complete microservice infrastructure:

```shell script
nx g @nx-cdk-deploy/preset <preset-name> <service-name> [options]
```


**Options:**
- `--env=<environment>` - Target environment (dev, staging, prod)
- `--skipFormat` - Skip code formatting
- `--dryRun` - Preview changes without applying

### Resource Generators

Add individual resources to existing services:

```shell script
# Add multiple resources at once
nx g @nx-cdk-deploy/resources <service-name> --add=s3,dynamodb

# Add individual resources
nx g @nx-cdk-deploy/api-service <service-name>
nx g @nx-cdk-deploy/dynamodb <service-name>
nx g @nx-cdk-deploy/sns-sqs <service-name>
nx g @nx-cdk-deploy/s3 <service-name>
```


---

## Executors

### Build Executor

Compile your CDK application:

```shell script
nx build <service-name>
```


### Deploy Executor

Deploy infrastructure to AWS:

```shell script
nx deploy <service-name> --env=<environment> [options]
```


**Options:**
- `--env=<environment>` - Target environment
- `--profile=<aws-profile>` - AWS profile to use
- `--region=<aws-region>` - AWS region
- `--require-approval=never` - Skip deployment approval

### Destroy Executor

Remove infrastructure from AWS:

```shell script
nx destroy <service-name> --env=<environment> [options]
```


**Options:**
- `--env=<environment>` - Target environment
- `--force` - Skip confirmation prompts

---

## Configuration

### Project Configuration

Each CDK project includes these configuration files:

```
apps/my-service/
├── infra/
│   └── my-service-stack.ts     # CDK stack definition
├── cdk.json                    # CDK configuration
├── cdk.context.dev.json        # Development context
├── cdk.context.staging.json    # Staging context
├── cdk.context.prod.json       # Production context
└── project.json                # Nx project configuration
```


### CDK Context Files

Environment-specific settings are managed through context files:

_cdk.context.dev.json_
```json
{
  "environment": "dev",
  "region": "us-east-1",
  "accountId": "123456789012",
  "stackName": "my-service-dev",
  "removalPolicy": "destroy"
}
```


_cdk.context.prod.json_
```json
{
  "environment": "prod",
  "region": "us-west-2", 
  "accountId": "123456789012",
  "stackName": "my-service-prod",
  "removalPolicy": "retain"
}
```


### Environment Variables

Sensitive configuration can be injected via environment variables:

```shell script
# AWS credentials
export AWS_PROFILE=my-profile
export AWS_REGION=us-east-1

# Application settings
export DATABASE_NAME=my-service-db
export API_STAGE=v1
```


---

## Environment Management

### Development Workflow

1. **Development** - Rapid iteration with ephemeral resources
2. **Staging** - Production-like environment for testing
3. **Production** - Live environment with persistent resources

### Context Inheritance

Environment contexts inherit from base settings and can override specific values:

```typescript
// In your stack
const context = this.node.tryGetContext('environment');
const dbConfig = context === 'prod' ? 
  { backup: true, multiAZ: true } : 
  { backup: false, multiAZ: false };
```


### Deployment Pipeline

```shell script
# Typical CI/CD workflow
nx build my-service
nx deploy my-service --env=staging
# Run integration tests
nx deploy my-service --env=prod
```


---

## Best Practices

### 🏗️ Architecture

- **Use presets** for consistent infrastructure patterns
- **Separate concerns** with individual resource generators
- **Follow naming conventions** for resources and environments
- **Implement proper IAM roles** with least-privilege access

### 🔒 Security

- **Store secrets** in AWS Systems Manager or Secrets Manager
- **Use environment-specific** IAM policies
- **Enable logging** for all AWS resources
- **Implement proper** VPC and security group configurations

### 🚀 Performance

- **Leverage Nx caching** for faster builds
- **Use CDK context** for environment-specific optimizations
- **Implement resource tagging** for cost tracking
- **Monitor and alert** on key metrics

### 📦 Organization

```
apps/
├── orders-service/          # Event-driven service
├── users-service/           # Storage service  
├── notifications-service/   # Worker service
└── shared/                  # Shared constructs
    ├── database/
    ├── messaging/
    └── storage/
```


---

## Examples

### Complete Event-Driven Architecture

```shell script
# Create order processing service
nx g @nx-cdk-deploy/preset event-service orders --env=dev

# Create notification worker
nx g @nx-cdk-deploy/preset worker-service notifications --env=dev

# Create user management service
nx g @nx-cdk-deploy/preset storage-service users --env=dev

# Deploy all services
nx run-many --target=deploy --projects=orders,notifications,users --env=dev
```


### Adding Resources to Existing Service

```shell script
# Add S3 and DynamoDB to an existing service
nx g @nx-cdk-deploy/resources orders --add=s3,dynamodb

# Deploy the updated service
nx deploy orders --env=dev
```


### Custom Resource Configuration

```typescript
// apps/orders/infra/orders-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class OrdersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Generated DynamoDB table with custom configuration
    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      // Environment-specific settings
      removalPolicy: this.getRemovalPolicy(),
    });
  }

  private getRemovalPolicy(): cdk.RemovalPolicy {
    const env = this.node.tryGetContext('environment');
    return env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY;
  }
}
```


---

## Troubleshooting

### Common Issues

#### ❌ CDK Bootstrap Error

```
Error: This stack uses assets, so the toolkit stack must be deployed
```


**Solution:**
```shell script
# Bootstrap your AWS environment
npx cdk bootstrap aws://ACCOUNT-ID/REGION
```


#### ❌ Permission Denied

```
Error: User is not authorized to perform: cloudformation:CreateStack
```


**Solution:**
- Ensure your AWS credentials have sufficient permissions
- Check IAM policies for CloudFormation, Lambda, API Gateway, etc.

#### ❌ Context Not Found

```
Error: Context value 'environment' not found
```


**Solution:**
```shell script
# Ensure you specify the environment
nx deploy orders --env=dev

# Or check your context files exist
ls apps/orders/cdk.context.*
```


### Debugging Tips

1. **Enable verbose logging:**
```shell script
nx deploy orders --env=dev --verbose
```


2. **Check CDK diff before deployment:**
```shell script
npx cdk diff --app "npx nx build orders && node dist/apps/orders/infra/app.js"
```


3. **Validate context loading:**
```shell script
npx cdk context --app "npx nx build orders && node dist/apps/orders/infra/app.js"
```


### Getting Help

- 📚 [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- 🐛 [Report Issues](https://github.com/mhshahzad/nx-cdk-deploy/issues)
- 💬 [Community Discussions](https://github.com/mhshahzad/nx-cdk-deploy/discussions)
- 📧 [Contact Support](mailto:muhammad@mhshahzad.tech)

---

## API Reference

### Generator Schemas

All generators accept these common options:

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `project` | string | Project name (required) | - |
| `env` | string | Target environment | `dev` |
| `skipFormat` | boolean | Skip code formatting | `false` |
| `dryRun` | boolean | Preview without applying | `false` |

### Executor Options

#### Deploy Executor

```typescript
interface DeployExecutorSchema {
  env: string;              // Target environment
  profile?: string;         // AWS profile
  region?: string;          // AWS region  
  requireApproval?: string; // Approval mode
  verbose?: boolean;        // Verbose logging
}
```


#### Destroy Executor

```typescript
interface DestroyExecutorSchema {
  env: string;      // Target environment
  force?: boolean;  // Skip confirmation
}
```


---

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork and clone** the repository
2. **Install dependencies:**
```shell script
npm install
```

3. **Create a test workspace:**
```shell script
npx create-nx-workspace test-workspace --preset=empty
   cd test-workspace
   npm install ../nx-cdk-deploy-plugin
```


### Testing Your Changes

```shell script
# Test generator
nx g @nx-cdk-deploy/preset event-service test-service --env=dev

# Test executor  
nx deploy test-service --env=dev --dryRun
```


### Submitting Changes

1. **Create a feature branch**
2. **Make your changes** with tests
3. **Run the test suite:**
```shell script
npm test
   npm run e2e
```

4. **Submit a pull request** with a clear description

### Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation for API changes
- Use conventional commit messages

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.
