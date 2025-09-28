import {
    Tree,
    formatFiles,
    readProjectConfiguration,
    names
} from '@nx/devkit';

export default async function snsSqsGenerator(
    tree: Tree,
    schema: { project: string }
) {
    const projectConfig = readProjectConfiguration(tree, schema.project);
    const infraPath = `${projectConfig.root}/infra/${schema.project}-stack.ts`;

    if (!tree.exists(infraPath)) {
        throw new Error(`Stack file not found: ${infraPath}`);
    }

    let content = tree.read(infraPath, 'utf-8')!;

    // Add imports if missing
    if (!content.includes('aws-sns')) {
        content =
            `import * as sns from 'aws-cdk-lib/aws-sns';\n` +
            `import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';\n` +
            content;
    }
    if (!content.includes('aws-sqs')) {
        content = `import * as sqs from 'aws-cdk-lib/aws-sqs';\n` + content;
    }

    // Add SNS + SQS + subscription snippet
    content = content.replace(
        /super\(scope, id, props\);\n\n/,
        `super(scope, id, props);\n\n    const ${names(schema.project).propertyName}Queue = new sqs.Queue(this, '${names(schema.project).className}Queue', {
      visibilityTimeout: cdk.Duration.seconds(30),
    });

    const ${names(schema.project).propertyName}Topic = new sns.Topic(this, '${names(schema.project).className}Topic');

    ${names(schema.project).propertyName}Topic.addSubscription(new subs.SqsSubscription(${names(schema.project).propertyName}Queue));\n\n`
    );

    tree.write(infraPath, content);
    await formatFiles(tree);
}
