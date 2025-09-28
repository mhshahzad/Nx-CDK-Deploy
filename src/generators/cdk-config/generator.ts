import {
    Tree,
    formatFiles,
    readProjectConfiguration,
} from '@nx/devkit';

interface Schema {
    project: string;
    env?: string;
}

export default async function cdkConfigGenerator(tree: Tree, schema: Schema) {
    const projectConfig = readProjectConfiguration(tree, schema.project);
    const infraPath = `${projectConfig.root}/infra`;

    const cdkJsonPath = `${infraPath}/cdk.json`;

    if (tree.exists(cdkJsonPath)) {
        console.log(`ℹ️ cdk.json already exists for ${schema.project}`);
        return;
    }

    const env = schema.env ?? 'dev';

    const content = {
        app: `npx ts-node --prefer-ts-exts ${schema.project}-stack.ts`,
        context: {
            env,
            [`${schema.project}:region`]: 'us-east-1',
            [`${schema.project}:stage`]: env,
        },
    };

    tree.write(cdkJsonPath, JSON.stringify(content, null, 2));
    await formatFiles(tree);

    console.log(`✅ Created cdk.json for project ${schema.project} [env: ${env}]`);
}
