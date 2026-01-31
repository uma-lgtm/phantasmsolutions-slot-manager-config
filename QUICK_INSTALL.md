# Quick Installation Fix

## The Problem

You're getting a 404 because:
1. ❌ Wrong package name: `@phantasm/slot-manager-config` 
2. ✅ Correct name: `@uma-lgtm/slot-manager-config`
3. ❌ Installing from npm registry instead of GitHub Packages

## Solution

### Step 1: Create `.npmrc` in Your Project Root

In your project where you want to install the package (e.g., `smokevana-sdk-54`), create `.npmrc`:

```bash
cd /path/to/your/project
cat > .npmrc << 'EOF'
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF
```

### Step 2: Set GitHub Token

```bash
export GITHUB_TOKEN=your_github_token_here
```

⚠️ **Note**: If your token expired, generate a new one:
- GitHub → Settings → Developer settings → Personal access tokens
- Create token with `read:packages` permission

### Step 3: Install with Correct Name

```bash
npm install @uma-lgtm/slot-manager-config
```

## Alternative: Install Directly from GitHub (No Auth Needed)

If GitHub Packages is causing issues:

```bash
npm install github:uma-lgtm/phantasmsolutions-slot-manager-config
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "@uma-lgtm/slot-manager-config": "github:uma-lgtm/phantasmsolutions-slot-manager-config"
  }
}
```

Then run:
```bash
npm install
```

## Verify Installation

After installation, check `package.json`:

```json
{
  "dependencies": {
    "@uma-lgtm/slot-manager-config": "^1.0.0"
  }
}
```

## Usage

```javascript
import { createSlotManagerConfig } from '@uma-lgtm/slot-manager-config';

const configService = createSlotManagerConfig({
  domain: 'com.yourdomain', // Your app domain
});

await configService.initialize();
const baseUrl = configService.getBaseUrl();
```
