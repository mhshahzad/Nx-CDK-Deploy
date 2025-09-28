import { ExecutorContext, runExecutor } from '@nx/devkit';
import { spawn } from 'child_process';
import * as path from 'path';

interface DeployExecutorOptions {
    stack: string;
    env: string;
    requireApproval: 'never' | 'any-change' | 'broadening';
}

export default async function deployExecutor(
    options: DeployExecutorOptions,
    context: ExecutorContext
) {
    const projectName = context.projectName!;
    console.log(`🚀 Deploying stack: ${options.stack} [env: ${options.env}]`);

    // STEP 1: Run the build target
    console.log(`🛠️ Building project "${projectName}"...`);
    for await (const result of await runExecutor(
        { project: projectName, target: 'build' },
        {},
        context
    )) {
        if (!result.success) {
            console.error(`❌ Build failed for project "${projectName}". Aborting deploy.`);
            return { success: false };
        }
    }

    // STEP 2: Locate the infra directory
    const projectRoot = context.root;
    const infraDir = path.join(projectRoot, 'infra');

    // STEP 3: Build CDK CLI args
    const args = [
        'cdk',
        'deploy',
        options.stack,
        '--require-approval',
        options.requireApproval,
        '--outputs-file',
        path.join(infraDir, `cdk-outputs.${options.env}.json`)
    ];

    // STEP 4: Run cdk deploy
    return new Promise<{ success: boolean }>((resolve) => {
        const child = spawn('npx', args, {
            cwd: infraDir,
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Stack ${options.stack} deployed successfully.`);
                resolve({ success: true });
            } else {
                console.error(`❌ Deployment failed with code ${code}`);
                resolve({ success: false });
            }
        });
    });
}
