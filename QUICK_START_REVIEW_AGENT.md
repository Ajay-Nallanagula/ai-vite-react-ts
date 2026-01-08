# Quick Start: Code Review Agent

## 🚀 Get Started in 2 Minutes

### 1. Run Code Review Analysis

```bash
npm run code-review -- --owner=YOUR_USERNAME --repo=YOUR_REPO --pr=1
```

**Example:**
```bash
npm run code-review -- --owner=ajay-epam --repo=ai-vite-react-ts --pr=5
```

### 2. View Generated Review

The analysis generates a summary like this:

```
## 🔍 Code Review Summary

### ❌ Errors (1)
### ⚠️ Warnings (3)
### ℹ️ Info (1)
```

### 3. Post to GitHub (Optional)

```bash
npm run post-review -- --pr=1
```

---

## 📋 What Gets Analyzed?

### TypeScript/React Files
- ❌ Console.log statements
- ⚠️ Missing error handling (async/await)
- ℹ️ Unformatted TODO comments
- ❌ Invalid imports

### CSS Files
- ⚠️ Excessive !important usage
- ℹ️ Inline style attributes

### JSON Files
- ❌ Syntax errors
- ✅ Valid structure

---

## 🔧 Customization

### Add Custom Rules

Edit **`scripts/codereview.agent.ts`** to add new analysis rules:

```typescript
// Example: Flag unused variables
if (line.includes('const ') && !line.includes('=')) {
  issues.push({
    path: filePath,
    line: index + 1,
    comment: '🚀 Potentially unused variable',
    severity: 'warning',
  })
}
```

### Change Severity Levels

Modify severity in the `ReviewIssue` interface:
```typescript
interface ReviewIssue {
  severity: 'error' | 'warning' | 'info'  // Change as needed
}
```

---

## 🤖 GitHub Actions Integration

The workflow automatically runs when:
- ✅ PR is opened
- ✅ New commits are pushed
- ✅ PR is reopened

No manual setup needed! Just push to the repo.

---

## 📊 Output Files

Review data is saved to:
```
.github/review-data/review-pr-<number>.json
```

Contains:
- PR metadata
- List of issues found
- Full review comment (markdown)
- Timestamp

---

## 💡 Tips

1. **Test locally first:**
   ```bash
   npm run code-review -- --owner=test --repo=test --pr=1
   ```

2. **See generated review data:**
   ```bash
   cat .github/review-data/review-pr-1.json
   ```

3. **Get help:**
   ```bash
   npm run review-help
   ```

4. **Check analysis logs:**
   - Look in GitHub Actions tab on your PR
   - Or in terminal output from npm command

---

## 🎯 Next Steps

1. ✅ Create a PR in this repository
2. ✅ Watch the agent analyze your code
3. ✅ See review comment appear automatically
4. ✅ Fix any issues highlighted

---

**Happy coding! 🎉**

For detailed documentation, see [CODE_REVIEW_AGENT.md](./CODE_REVIEW_AGENT.md)
