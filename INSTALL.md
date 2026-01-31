# Installation Guide

## Important: Package Name

The package name is: **`@uma-lgtm/slot-manager-config`**

⚠️ **NOT** `@phantasm/slot-manager-config`

## Step 1: Configure GitHub Packages Authentication

Create or update `.npmrc` file in your **project root** (where you want to install the package):

```bash
# .npmrc in your project root
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Step 2: Set GitHub Token

Set your GitHub Personal Access Token as an environment variable:

```bash
export GITHUB_TOKEN=your_github_token_here
```

Or add it directly to `.npmrc`:

```bash
# .npmrc
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

## Step 3: Install the Package

```bash
npm install @uma-lgtm/slot-manager-config
```

Or with yarn:

```bash
yarn add @uma-lgtm/slot-manager-config
```

## Alternative: Install Directly from GitHub

If GitHub Packages authentication is causing issues, you can install directly from GitHub:

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

## Troubleshooting

### Error: "Access token expired or revoked"

1. Generate a new GitHub Personal Access Token:
   - Go to: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Create new token with `read:packages` permission
   - Copy the token

2. Update your `.npmrc` or environment variable with the new token

### Error: "404 Not Found"

- Make sure you're using the correct package name: `@uma-lgtm/slot-manager-config`
- Verify `.npmrc` is in your project root
- Check that `GITHUB_TOKEN` environment variable is set (if using `${GITHUB_TOKEN}`)

### Error: "403 Forbidden"

- Make sure your token has `read:packages` permission
- Verify the package scope matches: `@uma-lgtm`
- Check that the repository exists and you have access

## Quick Setup Script

```bash
# Create .npmrc in project root
cat > .npmrc << EOF
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

# Set token (replace with your actual token)
export GITHUB_TOKEN=ghp_your_token_here

# Install package
npm install @uma-lgtm/slot-manager-config
```
