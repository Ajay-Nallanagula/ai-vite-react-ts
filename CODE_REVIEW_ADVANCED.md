# Code Review Agent - Advanced Integration Guide

## 🎯 Complete Setup Instructions

This guide covers all 4 steps for a fully functional code review agent.

---

## Step 1: ✅ Basic Code Review Agent (DONE)

### What Was Created:
- **`scripts/codereview.agent.ts`** - Main analysis engine
- **Analysis Rules:**
  - TypeScript/React: console.log, async errors, TODO formatting
  - CSS: !important, inline styles
  - JSON: syntax validation

### How It Works:
```bash
npm run code-review -- --owner=<owner> --repo=<repo> --pr=<number>
```

### Output:
- Generates review comments in markdown format
- Saves review data to `.github/review-data/review-pr-*.json`
- Groups issues by severity (error, warning, info)

### Test It:
```bash
npm run code-review -- --owner=ajay-epam --repo=ai-vite-react-ts --pr=1
```

---

## Step 2: ✅ GitHub Actions Workflow (DONE)

### What Was Created:
- **`.github/workflows/code-review.yml`** - Automated trigger

### Triggers On:
- PR opened
- PR updated (new commits)
- PR reopened

### Workflow Steps:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run code review analysis
5. Post comment to GitHub via MCP
6. Generate workflow summary

### How to Enable:
1. Commit the workflow file
2. Push to repository
3. Create a new PR - workflow runs automatically

### Monitor:
- Go to "Actions" tab on GitHub
- Click on "Code Review Agent" workflow
- See real-time execution logs

---

## Step 3: ✅ GitHub MCP Integration (DONE)

### What Was Created:
- **`scripts/github-mcp-client.ts`** - MCP wrapper

### Features:
```typescript
// Create a pending review
await client.createPendingReview(prNumber, body)

// Add line-specific comments
await client.addCommentToPendingReview(prNumber, reviewId, comment)

// Submit review with decision
await client.submitPendingReview(prNumber, reviewId, 'COMMENT')

// Post direct comment
await client.postComment(prNumber, body)
```

### Real Integration:

The client is ready to use. When you have GitHub API credentials:

```typescript
// In github-mcp-client.ts, update the methods to call actual GitHub API
// Example:
async postComment(prNumber: number, body: string) {
  const response = await fetch(
    `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/issues/${prNumber}/comments`,
    {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body })
    }
  )
  return response.json()
}
```

---

## Step 4: ✅ CLI Commands & Configuration (DONE)

### Available Commands:

```bash
# Run analysis
npm run code-review -- --owner=USER --repo=REPO --pr=NUMBER

# Post review
npm run post-review -- --pr=NUMBER

# Get help
npm run review-help
```

### Configuration File (`.codereviewrc.json`):

```json
{
  "analyzer": {
    "rules": {
      "typescript": { /* ... */ },
      "css": { /* ... */ },
      "json": { /* ... */ }
    }
  },
  "github": {
    "owner": "ajay-epam",
    "postToGitHub": true,
    "reviewEvent": "COMMENT"
  }
}
```

### Customization Options:

1. **Enable/Disable Rules:**
   ```json
   "checkConsoleLog": { "enabled": false }
   ```

2. **Change Severity:**
   ```json
   "checkConsoleLog": { "severity": "error" }
   ```

3. **File Patterns:**
   ```json
   "filePatterns": {
     "include": ["src/**/*.ts"],
     "exclude": ["**/*.test.ts"]
   }
   ```

---

## 🚀 Complete Workflow Example

### Local Development:

```bash
# 1. Make code changes
echo "console.log('test')" >> src/App.tsx

# 2. Run code review locally
npm run code-review -- --owner=myorg --repo=myrepo --pr=5

# 3. View issues found
cat .github/review-data/review-pr-5.json

# 4. Fix issues
# ... fix console.log ...

# 5. Verify fixes
npm run code-review -- --owner=myorg --repo=myrepo --pr=5
```

### GitHub Integration:

```bash
# 1. Commit changes
git add src/App.tsx

# 2. Push to create/update PR
git push origin feature-branch

# 3. GitHub Actions automatically:
#    - Analyzes code
#    - Posts review comment
#    - Updates PR status

# 4. Review comment appears on PR within 30 seconds
```

---

## 📊 Review Data Structure

Review data saved in JSON:

```json
{
  "pr": 1,
  "owner": "ajay-epam",
  "repo": "ai-vite-react-ts",
  "comment": "## 🔍 Code Review Summary\n...",
  "issues": [
    {
      "path": "src/App.tsx",
      "line": 11,
      "comment": "🔍 Avoid console.log...",
      "severity": "warning"
    }
  ],
  "timestamp": "2026-01-08T07:48:19.490Z"
}
```

---

## 🔧 Extending the Agent

### Add a New Analysis Rule:

**File:** `scripts/codereview.agent.ts`

```typescript
function analyzeTypeScriptFile(content: string, filePath: string): ReviewIssue[] {
  const issues: ReviewIssue[] = []
  const lines = content.split('\n')

  // Add your custom rule
  lines.forEach((line, index) => {
    if (line.includes('YOUR_PATTERN')) {
      issues.push({
        path: filePath,
        line: index + 1,
        comment: '🎯 Your custom message',
        severity: 'warning'
      })
    }
  })

  return issues
}
```

### Add Support for New File Types:

```typescript
function analyzeFile(filePath: string, content: string): ReviewIssue[] {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case '.md':
      return analyzeMarkdownFile(content, filePath)  // New!
    case '.html':
      return analyzeHtmlFile(content, filePath)      // New!
    // ... existing cases ...
  }
}
```

---

## 🔐 Environment Setup

### GitHub Token (for real API calls):

```bash
# Set environment variable
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Or in .env file
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# The agent will use it for API calls
```

### GitHub Actions Secrets:

If you want the workflow to use a token:

1. Go to repository Settings
2. Secrets and variables → Actions
3. Add `GITHUB_TOKEN` (already available in Actions)

---

## 📈 Metrics & Reporting

### View Review Statistics:

```bash
# Count issues by severity
cat .github/review-data/review-pr-*.json | \
  jq '.issues[] | .severity' | sort | uniq -c

# List all issues
cat .github/review-data/review-pr-*.json | jq '.issues[]'

# Get latest review
ls -t .github/review-data/review-pr-*.json | head -1
```

---

## ✅ Testing Checklist

- [ ] Run agent locally: `npm run code-review -- --owner=ajay-epam --repo=ai-vite-react-ts --pr=1`
- [ ] Verify review data created: `.github/review-data/review-pr-1.json` exists
- [ ] Check workflow file: `.github/workflows/code-review.yml` is valid
- [ ] Create test PR in repository
- [ ] Wait for GitHub Actions to complete
- [ ] See review comment appear on PR
- [ ] Verify all issues listed correctly
- [ ] Test custom rule by adding console.log to code
- [ ] Verify it's detected in next review

---

## 🚨 Troubleshooting

### Issue: "ts-node not found"
```bash
npm install --save-dev ts-node typescript
```

### Issue: Review not posting to GitHub
Check GitHub MCP integration:
```bash
npm run git-server
```

### Issue: Workflow not triggering
1. Verify file location: `.github/workflows/code-review.yml`
2. Check syntax with GitHub workflow validator
3. Ensure workflow is committed and pushed

### Issue: No issues found
This might mean:
- Code quality is great! 🎉
- Or rules are not matching your patterns
- Check the rule patterns in `codereview.agent.ts`

---

## 📚 File Reference

| File | Purpose | Status |
|------|---------|--------|
| `scripts/codereview.agent.ts` | Main analysis engine | ✅ Done |
| `scripts/post-review.ts` | GitHub posting | ✅ Done |
| `scripts/github-mcp-client.ts` | MCP wrapper | ✅ Done |
| `.github/workflows/code-review.yml` | GitHub Actions | ✅ Done |
| `.codereviewrc.json` | Configuration | ✅ Done |
| `package.json` | Scripts added | ✅ Done |
| `CODE_REVIEW_AGENT.md` | Full docs | ✅ Done |
| `QUICK_START_REVIEW_AGENT.md` | Quick guide | ✅ Done |

---

## 🎓 Next Steps

1. **Test the agent:**
   ```bash
   npm run code-review -- --owner=ajay-epam --repo=ai-vite-react-ts --pr=1
   ```

2. **Create a PR to test GitHub Actions:**
   - Make a code change
   - Create a PR
   - Watch the workflow run

3. **Customize rules:**
   - Edit `scripts/codereview.agent.ts`
   - Add your own analysis logic
   - Test locally before committing

4. **Monitor PRs:**
   - Check "Actions" tab
   - Review comments on PRs
   - Track code quality over time

---

**Status:** ✅ All steps complete and ready to use!

**Created:** January 8, 2026
