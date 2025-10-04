#!/usr/bin/env node

/**
 * GitHub Trending API Deployment Setup Script (Node.js)
 * Cross-platform deployment environment setup
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

// Utility functions
function printStatus(message) {
    console.log(`${colors.green}[INFO]${colors.reset} ${message}`);
}

function printWarning(message) {
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function printError(message) {
    console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function printStep(message) {
    console.log(`${colors.blue}[STEP]${colors.reset} ${message}`);
}

// Check if command exists
function commandExists(command) {
    try {
        execSync(`${command} --version`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Execute command and return output
function execCommand(command, options = {}) {
    try {
        return execSync(command, { 
            encoding: 'utf8', 
            stdio: options.silent ? 'pipe' : 'inherit',
            ...options 
        });
    } catch (error) {
        if (!options.silent) {
            printError(`Command failed: ${command}`);
        }
        throw error;
    }
}

// Prompt user for input
function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().trim());
        });
    });
}

async function main() {
    printStatus('GitHub Trending API Deployment Setup');
    printStatus('=====================================');

    try {
        // Step 1: Check Wrangler CLI
        printStep('1. Checking Wrangler CLI installation...');
        if (!commandExists('wrangler')) {
            printWarning('Wrangler CLI is not installed.');
            const install = await askQuestion('Would you like to install it now? (y/n): ');
            
            if (install === 'y' || install === 'yes') {
                printStatus('Installing Wrangler CLI...');
                execCommand('npm install -g wrangler');
                printStatus('Wrangler CLI installed successfully.');
            } else {
                printError('Wrangler CLI is required for deployment.');
                printError('Please install it manually: npm install -g wrangler');
                process.exit(1);
            }
        } else {
            printStatus('Wrangler CLI is already installed.');
        }

        // Step 2: Check authentication
        printStep('2. Checking Cloudflare authentication...');
        try {
            execCommand('wrangler whoami', { silent: true });
            printStatus('Already authenticated with Cloudflare.');
        } catch {
            printWarning('Not logged in to Cloudflare.');
            const login = await askQuestion('Would you like to login now? (y/n): ');
            
            if (login === 'y' || login === 'yes') {
                printStatus('Opening Cloudflare login...');
                execCommand('wrangler login');
            } else {
                printError('Cloudflare authentication is required.');
                printError('Please run: wrangler login');
                process.exit(1);
            }
        }

        // Step 3: Create KV namespaces
        printStep('3. Setting up KV namespaces...');
        
        const environments = ['production', 'staging'];
        const kvIds = {};

        for (const env of environments) {
            try {
                printStatus(`Creating ${env} KV namespace...`);
                const output = execCommand(`wrangler kv:namespace create "TRENDING_KV" --env ${env}`, { silent: true });
                const match = output.match(/id = "([^"]+)"/);
                if (match) {
                    kvIds[env] = match[1];
                    printStatus(`${env} KV namespace created: ${match[1]}`);
                }
            } catch {
                printWarning(`Failed to create ${env} KV namespace or it already exists.`);
            }
        }

        // Create preview namespace
        try {
            printStatus('Creating preview KV namespace...');
            const output = execCommand('wrangler kv:namespace create "TRENDING_KV" --preview', { silent: true });
            const match = output.match(/id = "([^"]+)"/);
            if (match) {
                kvIds.preview = match[1];
                printStatus(`Preview KV namespace created: ${match[1]}`);
            }
        } catch {
            printWarning('Failed to create preview KV namespace or it already exists.');
        }

        // Step 4: Update wrangler.toml
        printStep('4. Updating wrangler.toml configuration...');
        const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
        
        if (fs.existsSync(wranglerPath) && kvIds.production && kvIds.preview) {
            // Create backup
            fs.copyFileSync(wranglerPath, `${wranglerPath}.backup`);
            
            // Read and update content
            let content = fs.readFileSync(wranglerPath, 'utf8');
            content = content.replace(/your-kv-namespace-id/g, kvIds.production);
            content = content.replace(/your-preview-kv-namespace-id/g, kvIds.preview);
            
            fs.writeFileSync(wranglerPath, content);
            printStatus('Updated wrangler.toml with KV namespace IDs');
        } else {
            printWarning('Could not update wrangler.toml automatically.');
            printWarning('Please update the KV namespace IDs manually.');
        }

        // Step 5: Set up secrets
        printStep('5. Setting up secrets...');
        printStatus('You need to set up the following secrets for each environment:');
        printStatus('- GITHUB_TOKEN: Your GitHub Personal Access Token');

        const hasToken = await askQuestion('Do you have a GitHub Personal Access Token ready? (y/n): ');
        
        if (hasToken === 'y' || hasToken === 'yes') {
            const envs = ['production', 'staging', 'development'];
            
            for (const env of envs) {
                printStatus(`Setting GITHUB_TOKEN for ${env} environment...`);
                console.log(`Please enter your GitHub Personal Access Token for ${env}:`);
                
                try {
                    execCommand(`wrangler secret put GITHUB_TOKEN --env ${env}`);
                } catch {
                    printWarning(`Failed to set secret for ${env} environment.`);
                }
            }
        } else {
            printWarning('Please create a GitHub Personal Access Token and set it using:');
            printWarning('wrangler secret put GITHUB_TOKEN --env production');
            printWarning('wrangler secret put GITHUB_TOKEN --env staging');
            printWarning('wrangler secret put GITHUB_TOKEN --env development');
        }

        // Step 6: Final instructions
        printStep('6. Setup complete!');
        printStatus('Your deployment environment is now configured.');
        printStatus('');
        printStatus('Next steps:');
        printStatus('1. Test your deployment: npm run deploy:staging');
        printStatus('2. Deploy to production: npm run deploy:production');
        printStatus('3. View logs: npm run logs:production');
        printStatus('');
        printStatus('For CI/CD, make sure to set these GitHub secrets:');
        printStatus('- CLOUDFLARE_API_TOKEN');
        printStatus('- CLOUDFLARE_ACCOUNT_ID');
        printStatus('- GITHUB_TOKEN_SECRET');

    } catch (error) {
        printError(`Setup failed: ${error.message}`);
        process.exit(1);
    }
}

// Run the setup
if (require.main === module) {
    main().catch((error) => {
        printError(`Unexpected error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { main };