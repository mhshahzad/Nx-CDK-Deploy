import { Tree, formatFiles } from '@nx/devkit';
import dynamoDbGenerator from '../dynamodb/generator';
import snsSqsGenerator from '../sns-sqs/generator';
import s3Generator from '../s3/generator';

interface Schema {
    project: string;
    add: string; // comma-separated list of resources
}

export default async function resourcesGenerator(tree: Tree, schema: Schema) {
    const resources = schema.add.split(',').map(r => r.trim());

    console.log(`⚡ Adding resources [${resources.join(', ')}] to ${schema.project}`);

    for (const res of resources) {
        switch (res) {
            case 'dynamodb':
                await dynamoDbGenerator(tree, { project: schema.project });
                break;
            case 'sns-sqs':
                await snsSqsGenerator(tree, { project: schema.project });
                break;
            case 's3':
                await s3Generator(tree, { project: schema.project });
                break;
            default:
                console.warn(`⚠️ Resource "${res}" is not supported yet.`);
        }
    }

    await formatFiles(tree);
}
