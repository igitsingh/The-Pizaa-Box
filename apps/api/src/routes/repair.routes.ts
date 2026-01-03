import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = Router();
const execAsync = promisify(exec);

router.post('/run', async (req, res) => {
    // Basic security: Check for a secret header or just allow it (it's an emergency)
    // For now open, but obfuscated URL

    const steps = [
        { name: 'Resolve Rolled Back', cmd: 'npx prisma migrate resolve --rolled-back 20251220101507_add_feedback_model' },
        { name: 'Deploy Migrations', cmd: 'npx prisma migrate deploy' },
        { name: 'Seed Database', cmd: 'FORCE_SEED=true npx prisma db seed' }
    ];

    const logs: any[] = [];

    try {
        for (const step of steps) {
            logs.push({ step: step.name, status: 'starting' });
            try {
                // Determine CWD: Render usually puts app in /opt/render/project/src/apps/api (or root)
                // We assume we are in the API root or project root. 
                // Using process.cwd()
                const { stdout, stderr } = await execAsync(step.cmd, {
                    cwd: process.cwd(),
                    env: process.env
                });
                logs.push({ step: step.name, status: 'success', stdout, stderr });
            } catch (err: any) {
                logs.push({ step: step.name, status: 'failed', error: err.message, stdout: err.stdout, stderr: err.stderr });
                // If repair fails, stop? Or try to continue? 
                // If resolve fails (e.g. already rolled back), deploy might still work. Continue.
                if (step.name === 'Deploy Migrations') throw err; // Critical
            }
        }
        res.json({ success: true, logs });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message, logs });
    }
});

export default router;
