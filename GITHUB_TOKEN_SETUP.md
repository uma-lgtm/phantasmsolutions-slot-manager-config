# How to Get GitHub Personal Access Token

## Step-by-Step Guide

### Step 1: Go to Your Personal Account Settings

1. **Click on your profile picture** (top right corner of GitHub)
2. Select **"Settings"** from the dropdown menu
   - ⚠️ **Important**: This is your **account settings**, NOT repository settings

### Step 2: Navigate to Developer Settings

1. In the left sidebar, scroll down to find **"Developer settings"**
   - It's usually near the bottom of the settings menu
   - Look for it under the "Account" section

### Step 3: Create Personal Access Token

1. Click on **"Developer settings"**
2. Click on **"Personal access tokens"**
3. Click on **"Tokens (classic)"** or **"Fine-grained tokens"**
   - For GitHub Packages, **"Tokens (classic)"** is recommended
4. Click **"Generate new token"** → **"Generate new token (classic)"**

### Step 4: Configure Token

1. **Note**: Give it a descriptive name like "GitHub Packages Token"
2. **Expiration**: Choose expiration (90 days, 1 year, or no expiration)
3. **Select scopes**: Check the following:
   - ✅ **`write:packages`** - Required to publish packages
   - ✅ **`read:packages`** - Required to install packages
   - ✅ **`repo`** - If your repository is private (optional but recommended)
4. Click **"Generate token"** at the bottom

### Step 5: Copy Token

1. **⚠️ IMPORTANT**: Copy the token immediately - you won't be able to see it again!
2. Save it securely (password manager, secure note, etc.)

### Step 6: Use Token

#### Option A: Set as Environment Variable

```bash
export GITHUB_TOKEN=your_token_here
```

#### Option B: Add to ~/.npmrc

Create or edit `~/.npmrc` in your home directory:

```
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=your_token_here
```

#### Option C: Add to Project .npmrc

Create `.npmrc` in your project root:

```
@uma-lgtm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then set the environment variable before running npm commands.

## Quick Navigation Path

```
GitHub.com
  → Click Profile Picture (top right)
    → Settings
      → Developer settings (left sidebar, bottom)
        → Personal access tokens
          → Tokens (classic)
            → Generate new token
```

## Troubleshooting

### Can't Find Developer Settings?

- Make sure you're in **Account Settings**, not Repository Settings
- Look at the URL - it should be: `https://github.com/settings/profile`
- Scroll down in the left sidebar - Developer settings is usually at the bottom

### Token Not Working?

- Make sure you selected `write:packages` scope
- Check if token has expired
- Verify `.npmrc` file is in the correct location
- Try regenerating the token

### Still Having Issues?

1. Check GitHub's official docs: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
2. Make sure you're logged into the correct GitHub account
3. Verify your account has access to the repository
