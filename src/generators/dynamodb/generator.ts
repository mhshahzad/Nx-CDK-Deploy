import {
    Tree,
    formatFiles,
    names,
    readProjectConfiguration
} from '@nx/devkit';

export default async function dynamoDbGenerator(
    tree: Tree,
    schema: { project: string }
) {
    const projectConfig = readProjectConfiguration(tree, schema.project);
    const infraPath = `${projectConfig.root}/infra/${schema.project}-stack.ts`;

    if (!tree.exists(infraPath)) {
        throw new Error(`Stack file not found: ${infraPath}`);
    }

    let content = tree.read(infraPath, 'utf-8')!;

    // Add import if missing
    if (!content.includes('aws-dynamodb')) {
        content =
            `import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';\n` + content;
    }

    // Add DynamoDB resource snippet
    content = content.replace(
        /super\(scope, id, props\);\n\n/,
        `super(scope, id, props);\n\n    const ${names(schema.project).propertyName}Table = new dynamodb.Table(this, '${names(schema.project).className}Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });\n\n`
    );

    tree.write(infraPath, content);
    await formatFiles(tree);
}
