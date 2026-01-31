# Publishing to GitHub Packages

## Prerequisites

1. Create a GitHub repository: `phantasmsolutions/slot-manager-config`
2. Get a GitHub Personal Access Token with `write:packages` permission
3. Set up authentication

## Setup

### 1. Authenticate with GitHub Packages

Create/update `.npmrc` in your home directory:

```bash
# ~/.npmrc
@phantasm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Or set environment variable:
```bash
export GITHUB_TOKEN=your_token_here
```

### 2. Initialize Git Repository

```bash
cd slot-manager-config
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/phantasmsolutions/slot-manager-config.git
git branch -M main
git push -u origin main
```

### 3. Publish Package

```bash
npm publish
```

## Installing the Package

### From GitHub Packages

1. Create `.npmrc` in your project root:

```
@phantasm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Install the package:

```bash
npm install @phantasm/slot-manager-config
```

### Using GitHub URL (Alternative)

```bash
npm install github:phantasmsolutions/slot-manager-config
```

## Version Management

To publish a new version:

1. Update version in `package.json`
2. Commit changes:
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```
3. Publish:
   ```bash
   npm publish
   ```

## Troubleshooting

### Authentication Issues

If you get authentication errors:
- Make sure your GitHub token has `write:packages` permission
- Check that `.npmrc` is in the correct location
- Verify the token is not expired

### Package Not Found

If installation fails:
- Make sure the repository exists and is public (or you have access)
- Verify the package name matches: `@phantasm/slot-manager-config`
- Check that you're authenticated with GitHub Packages
