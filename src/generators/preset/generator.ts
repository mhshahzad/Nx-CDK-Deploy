import { Tree, readJson, formatFiles } from '@nx/devkit';
import dynamoDbGenerator from '../dynamodb/generator';
import snsSqsGenerator from '../sns-sqs/generator';
import s3Generator from '../s3/generator';
import cdkConfigGenerator from '../cdk-config/generator';

interface Schema {
    name: string;
    preset: string;
    env?: string;
}

const resourceMap: Record<string, any> = {
    dynamodb: dynamoDbGenerator,
    'sns-sqs': snsSqsGenerator,
    s3: s3Generator
};

export default async function presetGenerator(tree: Tree, schema: Schema) {
    const { name, preset, env = 'dev' } = schema;

    const presets = readJson(tree, 'tools/nx-cdk-presets.json');

    if (!presets[preset]) {
        throw new Error(`Preset "${preset}" not found in nx-cdk-presets.json`);
    }

    console.log(`⚡ Applying preset "${preset}" for project "${name}"`);

    // Step 1: Scaffold CDK config first
    await cdkConfigGenerator(tree, { project: name, env });

    // Step 2: Loop through all resources in the preset
    for (const res of presets[preset].resources) {
        if (!resourceMap[res]) {
            console.warn(`⚠️ Resource "${res}" is not implemented`);
            continue;
        }
        await resourceMap[res](tree, { project: name });
    }

    await formatFiles(tree);
    console.log(`✅ Preset "${preset}" applied for project "${name}"`);
}
