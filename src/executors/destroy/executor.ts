import { ExecutorContext } from '@nx/devkit';
import { spawn } from 'child_process';
import * as path from 'path';

interface DestroyExecutorOptions {
    stack: string;
    env: string;
    force?: boolean;
}

export default async function destroyExecutor(
    options: DestroyExecutorOptions,
    context: ExecutorContext
) {
    const projectName = context.projectName!;
    console.log(`🧨 Destroying stack: ${options.stack} [env: ${options.env}]`);

    // Locate infra dir
    const projectRoot = context.root;
    const infraDir = path.join(projectRoot, 'infra');

    // Build CDK CLI args
    const args = [
        'cdk',
        'destroy',
        options.stack,
        '--force', // always skip confirmations in CI/CD
    ];

    return new Promise<{ success: boolean }>((resolve) => {
        const child = spawn('npx', args, {
            cwd: infraDir,
            stdio: 'inherit',
            shell: true,
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Stack ${options.stack} destroyed successfully.`);
                resolve({ success: true });
            } else {
                console.error(`❌ Destroy failed with code ${code}`);
                resolve({ success: false });
            }
        });
    });
}
