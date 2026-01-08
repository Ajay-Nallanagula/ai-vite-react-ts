# 🔒 Branch Protection Rules Setup

## Now Merge is Blocked When Errors Exist ✅

Your code review agent now **fails the workflow when errors are found**, which prevents merges. Here's how to enforce it:

---

## Step 1: Set Up Branch Protection Rules (GitHub)

### Go to Repository Settings

1. GitHub → Your Repository
2. **Settings** → **Branches**
3. Click **Add rule** (under Branch protection rules)

### Configure Protection

**Branch name pattern:** `main` (or your main branch)

Enable these checks:

✅ **Require a pull request before merging**
- Require approvals: `1`
- Dismiss stale review approvals when new commits are pushed

✅ **Require status checks to pass before merging**
- Select: `code-review` (the workflow)
- ✔️ Require branches to be up to date before merging

✅ **Require conversation resolution before merging**

✅ **Include administrators** (so rules apply to everyone)

### Result

```
PR Status:

✅ All checks must pass
├── code-review (workflow)
├── 1 approval required
└── Conversation resolved

❌ Cannot merge with failing checks
```

---

## Step 2: How It Works Now

### Scenario: Merge with Errors

```
1. Developer pushes code with errors
   ↓
2. GitHub Actions runs code review
   ↓
3. Agent finds errors
   ↓
4. Workflow FAILS (exit code 1)
   ↓
5. Merge button DISABLED
   ↓
6. Error shown in PR:
   "❌ Code Review checks must pass before merging"
```

### Scenario: Fix Errors

```
1. Developer fixes errors in code
   ↓
2. Push new commits
   ↓
3. Agent re-analyzes
   ↓
4. All errors fixed → Workflow PASSES
   ↓
5. Merge button ENABLED ✅
```

---

## Step 3: What Changed in Code

### In `scripts/codereview.agent.ts`:

```typescript
// Step 7: Fail if errors found (blocks merge with branch protection)
const errorCount = allIssues.filter((issue) => issue.severity === "error")
  .length;
if (errorCount > 0) {
  console.error(
    `\n❌ WORKFLOW FAILED: ${errorCount} error(s) found. Fix before merging.`
  );
  process.exit(1);  // ← Fails the workflow
}
```

### In `.github/workflows/code-review.yml`:

```yaml
- name: 🔒 Block merge if errors found
  if: failure()
  run: |
    echo "❌ Code review found errors that must be fixed before merging."
    exit 1
```

---

## Step 4: Test It

### Create a test PR with errors:

```bash
# 1. Create feature branch
git checkout -b test/review-errors

# 2. Add code with error
echo "console.log('test')" >> src/App.tsx

# 3. Push and create PR
git add .
git commit -m "Test code review blocking"
git push origin test/review-errors
```

### Watch what happens:

1. ✅ Code review runs
2. ❌ Finds console.log (error)
3. ❌ Workflow fails
4. 🔴 Merge button **disabled**
5. PR shows: "Required status check failing"

### Fix and try again:

```bash
# 1. Remove error
git checkout src/App.tsx

# 2. Commit and push
git add .
git commit -m "Fix: Remove console.log"
git push

# 3. Workflow re-runs
# 4. ✅ All checks pass
# 5. 🟢 Merge button **enabled**
```

---

## Error vs Warning vs Info

| Type | Blocks Merge | Action |
|------|-------------|--------|
| ❌ Error | YES | Must fix before merge |
| ⚠️ Warning | NO | Should fix but not blocking |
| ℹ️ Info | NO | Nice to have |

### Current Error Triggers:

- Malformed imports
- JSON syntax errors
- (Customizable in `codereview.agent.ts`)

### Current Warnings:

- console.log statements
- Missing async error handling
- CSS !important overuse
- (Don't block merge)

---

## Customization

### Make a Check a Blocking Error:

Edit `scripts/codereview.agent.ts`:

```typescript
// Change this line to flag something as error instead of warning
issues.push({
  path: filePath,
  line: index + 1,
  comment: '...',
  severity: 'error'  // ← Change from 'warning' to 'error'
})
```

### Remove Merge Blocking (Allow Warnings):

Edit `scripts/codereview.agent.ts`:

```typescript
// Remove or comment out this block:
// const errorCount = allIssues.filter(...).length;
// if (errorCount > 0) { process.exit(1); }
```

---

## GitHub Protection Rules Checklist

- [ ] Go to Settings → Branches
- [ ] Click "Add rule"
- [ ] Enter branch name: `main`
- [ ] ✅ Require pull request before merging
- [ ] ✅ Require status checks to pass (select `code-review`)
- [ ] ✅ Require conversation resolution
- [ ] ✅ Include administrators
- [ ] Click "Create"

---

## FAQ

**Q: Why can't I merge even though code is fine?**
A: The code review workflow is failing. Check the workflow logs in the Actions tab.

**Q: How do I bypass the check?**
A: Admins can if you enable "Allow administrators to bypass required status checks" in branch protection rules.

**Q: Can I make warnings block merges too?**
A: Yes, change `severity: 'warning'` to `severity: 'error'` in the agent.

**Q: What if I disagree with an error?**
A: Edit the analysis rules in `scripts/codereview.agent.ts` and adjust the logic.

---

## Visual Flow

```
Developer Push
    │
    ▼
GitHub Actions Triggers
    │
    ├─ code-review.agent.ts runs
    │  ├─ Analyzes files
    │  ├─ Finds errors
    │  └─ (exit 1 if errors)
    │
    ▼
Workflow Result
    │
    ├─ ❌ FAILED (if errors)
    │   └─ Merge DISABLED
    │
    └─ ✅ PASSED (if no errors)
        └─ Merge ENABLED (with approval)
```

---

## Summary

| Before | After |
|--------|-------|
| Agent finds errors | ✅ Same |
| Posts comments | ✅ Same |
| Merge still allowed | ❌ **Now blocked** |
| | ✅ **Merge disabled until fixed** |

**Now your merge button is protected!** 🔒

---

**Setup Time:** ~2 minutes  
**Enforcement:** Automatic on all PRs
