import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

const ENV_FILE = '.env.local';
const TARGET_ENVIRONMENTS = ['production', 'preview', 'development'];

try {
    const filePath = join(process.cwd(), ENV_FILE);
    const content = readFileSync(filePath, 'utf8');

    const lines = content.split('\n');

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        // Match KEY="VALUE" or KEY=VALUE
        const match = line.match(/^([^=]+)=(.*)$/);
        if (!match) continue;

        let key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);

        // Skip Vercel internal vars if they leaked into .env.local
        if (key.startsWith('VERCEL_')) continue;

        console.log(`\n🚀 Syncing ${key}...`);

        for (const env of TARGET_ENVIRONMENTS) {
            try {
                // Use echo to pipe value into vercel env add to handle special characters
                // On Windows (cmd/powershell), piping can be tricky, but Node execSync handles basic strings
                // We'll use the stdin approach via a simple command string
                const command = `npx vercel env add ${key} ${env} --force`;
                console.log(`  - Adding to ${env}...`);
                execSync(command, { input: value, stdio: ['pipe', 'ignore', 'pipe'] });
            } catch (err) {
                console.error(`  ❌ Failed to sync ${key} to ${env}:`, err.message);
            }
        }
    }

    console.log('\n✅ All environment variables synced to Vercel!');
    console.log('💡 Remember: You must trigger a new deployment for changes to take effect.');

} catch (error) {
    if (error.code === 'ENOENT') {
        console.error('❌ Error: .env.local file not found.');
    } else {
        console.error('❌ An error occurred:', error.message);
    }
    process.exit(1);
}
