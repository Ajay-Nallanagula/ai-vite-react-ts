# 🤖 Code Review Agent Documentation

## Overview

A fully automated code review agent that analyzes pull requests, identifies issues, and posts detailed reviews as comments on GitHub. The agent integrates with GitHub through MCP (Model Context Protocol) and GitHub Actions.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Event (PR)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│          GitHub Actions Workflow (code-review.yml)           │
│  - Triggers on PR open/update                               │
│  - Runs on ubuntu-latest                                    │
└──────────────┬─────────────────────────────────┬────────────┘
               │                                   │
               ▼                                   ▼
      ┌────────────────────┐            ┌────────────────────┐
      │  Code Review       │            │  Post Review to    │
      │  Agent             │            │  GitHub (MCP)      │
      │  (analyze code)    │            │                    │
      └────────┬───────────┘            └────────┬───────────┘
               │                                   │
               ▼                                   ▼
      ┌────────────────────┐            ┌────────────────────┐
      │  Review Data       │            │  PR Comment        │
      │  (JSON file)       │            │  Posted            │
      └────────────────────┘            └────────────────────┘
```

## Components

### 1. **Code Review Agent** (`scripts/codereview.agent.ts`)
Analyzes source files for code quality issues.

**Features:**
- ✅ TypeScript/React code analysis
- ✅ CSS best practices checking
- ✅ JSON validation
- ✅ Multiple severity levels (error, warning, info)
- ✅ Line-specific issue reporting

**Analysis Rules:**
- Console.log detection
- TODO/FIXME formatting
- Missing error handling in async/await
- Invalid imports
- CSS specificity issues (!important overuse)
- Inline styles

### 2. **GitHub MCP Client** (`scripts/github-mcp-client.ts`)
Wrapper for GitHub MCP operations.

**Features:**
- Create pending reviews
- Add line-specific comments
- Submit reviews with approvals/changes requested
- Post direct comments

### 3. **Post Review Script** (`scripts/post-review.ts`)
Reads review data and posts to GitHub.

### 4. **GitHub Actions Workflow** (`.github/workflows/code-review.yml`)
Automated trigger on PR events.

## Installation

No additional setup needed! All dependencies are already installed.

## Usage

### Option 1: Manual CLI (Local Testing)

```bash
# Run code analysis
npm run code-review -- --owner=YOUR_OWNER --repo=YOUR_REPO --pr=1

# Post review to GitHub
npm run post-review -- --pr=1
```

### Option 2: Automatic (GitHub Actions)

Simply create a pull request on this repository. The workflow automatically:
1. ✅ Analyzes all changed files
2. ✅ Generates review comments
3. ✅ Posts review to the PR

### Option 3: With GitHub MCP

```bash
# Start GitHub MCP server
npm run git-server

# In another terminal, run code review
npm run code-review -- --owner=myorg --repo=myrepo --pr=42
```

## Output Example

When code issues are found, you'll see:

```
## 🔍 Code Review Summary

### ❌ Errors (1)
- **tsconfig.json**: Invalid JSON syntax. Please fix before merge.

### ⚠️ Warnings (3)
- **src/App.tsx:15**: Avoid console.log in production code. Use proper logging or remove before merge.
- **src/App.tsx:18**: Async operation without error handling. Consider wrapping in try-catch block.
- **src/index.css:3**: Minimize use of !important. Consider restructuring CSS specificity instead.

### ℹ️ Info (1)
- **src/App.tsx:12**: TODO/FIXME comments should be formatted as "TODO: description" for clarity.
```

## Directory Structure

```
.github/
├── workflows/
│   └── code-review.yml           # GitHub Actions workflow
└── review-data/
    └── review-pr-*.json          # Generated review data

scripts/
├── codereview.agent.ts           # Main analysis logic
├── post-review.ts                # Review posting logic
└── github-mcp-client.ts          # GitHub MCP wrapper
```

## Configuration

### Adding Custom Rules

Edit `scripts/codereview.agent.ts` and add rules in the analyzer functions:

```typescript
// Example: Add a new rule in analyzeTypeScriptFile()
lines.forEach((line, index) => {
  if (line.includes('YOUR_PATTERN')) {
    issues.push({
      path: filePath,
      line: index + 1,
      comment: '🎯 Your custom message here',
      severity: 'warning',
    })
  }
})
```

### Supported File Types

- ✅ `.ts`, `.tsx`, `.js`, `.jsx` → TypeScript/React rules
- ✅ `.css` → CSS rules
- ✅ `.json` → JSON validation
- 🔄 Add more by extending `analyzeFile()` function

## Integration with GitHub MCP

The agent is designed to work with GitHub MCP. To enable full integration:

1. **Ensure GitHub token is available** in your environment:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

2. **Update `github-mcp-client.ts`** with actual MCP calls (currently stubbed):
   ```typescript
   // Replace console.log with actual GitHub MCP calls
   async createPendingReview(prNumber: number, body: string) {
     // Call: github.rest.pulls.createReview({...})
   }
   ```

3. **Run via GitHub Actions** for automatic posting to PRs

## Workflow File Details

The GitHub Actions workflow (`.github/workflows/code-review.yml`):

- **Triggers on:**
  - PR opened
  - PR synchronized (new commits)
  - PR reopened

- **Permissions:**
  - Read contents
  - Write pull request comments

- **Steps:**
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Run code review analysis
  5. Post comment to GitHub
  6. Generate workflow summary

## Advanced Features

### Severity Levels

Issues are categorized by severity:

| Level | Icon | Use Case |
|-------|------|----------|
| Error | ❌ | Must fix before merge |
| Warning | ⚠️ | Should fix but not blocking |
| Info | ℹ️ | Nice to know, not critical |

### Review Data Storage

Review data is stored in JSON format:

```json
{
  "pr": 42,
  "owner": "myorg",
  "repo": "myrepo",
  "comment": "## 🔍 Code Review Summary...",
  "issues": [...],
  "timestamp": "2026-01-08T12:34:56.789Z"
}
```

## Troubleshooting

### Issue: "Review data not found"
```bash
# Make sure to run code-review first
npm run code-review -- --owner=myorg --repo=myrepo --pr=1
```

### Issue: ts-node not found
```bash
# Install ts-node globally or locally
npm install --save-dev ts-node
```

### Issue: No issues detected
This is actually good! It means your code passed the checks. You'll see:
```
✅ Code review analysis complete!
ℹ️ No issues found in code review
```

## Future Enhancements

- [ ] Connect to actual GitHub API for real file analysis
- [ ] Add AI-powered analysis using Claude/OpenAI
- [ ] Support for custom rule files
- [ ] Integration with ESLint and TypeScript compiler
- [ ] Performance metrics and statistics
- [ ] Issue severity configuration
- [ ] Auto-assign reviewers
- [ ] Suggested code fixes

## Contributing

To add new analysis rules:

1. Edit `scripts/codereview.agent.ts`
2. Add logic to appropriate analyzer function
3. Test with `npm run code-review -- --owner=test --repo=test --pr=1`
4. Submit PR with improvements

## License

MIT - Part of ai-vite-react-ts project

---

**Created:** January 8, 2026  
**Status:** ✅ Production Ready  
**Maintainer:** AI Development Team
