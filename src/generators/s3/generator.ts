
import {
    Tree,
    formatFiles,
    readProjectConfiguration,
    names
} from '@nx/devkit';

export default async function s3Generator(
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
    if (!content.includes('aws-s3')) {
        content =
            `import * as s3 from 'aws-cdk-lib/aws-s3';\n` +
            content;
    }
    
    // Add S3 snippet
    content = content.replace(
        /super\(scope, id, props\);\n\n/,
        `super(scope, id, props);\n\n    const ${names(schema.project).propertyName}Bucket = new s3.Bucket(this, '${names(schema.project).className}Bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });\n\n`
    );

    tree.write(infraPath, content);
    await formatFiles(tree);
}
