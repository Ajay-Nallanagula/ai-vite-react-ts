#!/usr/bin/env node
/**
 * Code Review Agent
 * Analyzes pull requests and posts review comments to GitHub
 * Usage: npx ts-node scripts/codereview.agent.ts --owner=<owner> --repo=<repo> --pr=<number>
 */

import * as fs from "fs";
import * as path from "path";

interface ReviewIssue {
  path: string;
  line?: number;
  comment: string;
  severity: "error" | "warning" | "info";
}

interface FileAnalysis {
  file: string;
  issues: ReviewIssue[];
}

/**
 * Parse command line arguments
 */
function parseArgs(): { owner: string; repo: string; pr: number } {
  const args = process.argv.slice(2);
  const params: any = {};

  args.forEach((arg) => {
    const [key, value] = arg.split("=");
    params[key.replace("--", "")] = value;
  });

  if (!params.owner || !params.repo || !params.pr) {
    console.error(
      "Usage: npx ts-node scripts/codereview.agent.ts --owner=<owner> --repo=<repo> --pr=<number>"
    );
    process.exit(1);
  }

  return {
    owner: params.owner,
    repo: params.repo,
    pr: parseInt(params.pr, 10),
  };
}

/**
 * Analyze TypeScript/React code for common issues
 */
function analyzeTypeScriptFile(
  content: string,
  filePath: string
): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  const lines = content.split("\n");

  // Rule 1: Check for console.log statements
  lines.forEach((line, index) => {
    if (line.includes("console.log")) {
      issues.push({
        path: filePath,
        line: index + 1,
        comment:
          "🔍 Avoid console.log in production code. Use proper logging or remove before merge.",
        severity: "warning",
      });
    }

    // Rule 2: Check for TODO/FIXME comments without context
    if (
      /TODO|FIXME/.test(line) &&
      !line.includes("TODO:") &&
      !line.includes("FIXME:")
    ) {
      issues.push({
        path: filePath,
        line: index + 1,
        comment:
          '📝 TODO/FIXME comments should be formatted as "TODO: description" for clarity.',
        severity: "info",
      });
    }

    // Rule 3: Check for missing error handling in async/await
    if (line.includes("await") && !line.includes("try")) {
      const nextLines = lines
        .slice(Math.max(0, index - 2), index + 3)
        .join("\n");
      if (!nextLines.includes("catch") && !nextLines.includes("try")) {
        issues.push({
          path: filePath,
          line: index + 1,
          comment:
            "⚠️ Async operation without error handling. Consider wrapping in try-catch block.",
          severity: "warning",
        });
      }
    }

    // Rule 4: Check for unused imports (basic check)
    if (line.trim().startsWith("import") && !line.includes("from")) {
      issues.push({
        path: filePath,
        line: index + 1,
        comment: "🗑️ Potentially malformed import statement. Please review.",
        severity: "error",
      });
    }
  });

  return issues;
}

/**
 * Analyze CSS file for common issues
 */
function analyzeCSSFile(content: string, filePath: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    // Check for !important overuse
    if (line.includes("!important")) {
      issues.push({
        path: filePath,
        line: index + 1,
        comment:
          "⚠️ Minimize use of !important. Consider restructuring CSS specificity instead.",
        severity: "warning",
      });
    }

    // Check for inline styles (in CSS files should be rare)
    if (line.includes("style=")) {
      issues.push({
        path: filePath,
        line: index + 1,
        comment:
          "💅 Avoid inline styles. Keep styles in CSS files or use CSS-in-JS solutions.",
        severity: "info",
      });
    }
  });

  return issues;
}

/**
 * Analyze JSON files
 */
function analyzeJsonFile(content: string, filePath: string): ReviewIssue[] {
  const issues: ReviewIssue[] = [];

  try {
    JSON.parse(content);
  } catch (error) {
    issues.push({
      path: filePath,
      comment: "❌ Invalid JSON syntax. Please fix before merge.",
      severity: "error",
    });
  }

  return issues;
}

/**
 * Main analysis function that routes to appropriate analyzer
 */
function analyzeFile(filePath: string, content: string): ReviewIssue[] {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".ts":
    case ".tsx":
    case ".js":
    case ".jsx":
      return analyzeTypeScriptFile(content, filePath);
    case ".css":
      return analyzeCSSFile(content, filePath);
    case ".json":
      return analyzeJsonFile(content, filePath);
    default:
      return [];
  }
}

/**
 * Format review issues as GitHub markdown comments
 */
function formatReviewComment(issues: ReviewIssue[]): string {
  if (issues.length === 0) return "";

  const grouped = issues.reduce(
    (acc, issue) => {
      const key = issue.severity;
      if (!acc[key]) acc[key] = [];
      acc[key].push(issue);
      return acc;
    },
    {} as Record<string, ReviewIssue[]>
  );

  let comment = "## 🔍 Code Review Summary\n\n";

  if (grouped.error && grouped.error.length > 0) {
    comment += `### ❌ Errors (${grouped.error.length})\n`;
    grouped.error.forEach((issue) => {
      comment += `- **${issue.path}${issue.line ? `:${issue.line}` : ""}**: ${issue.comment}\n`;
    });
    comment += "\n";
  }

  if (grouped.warning && grouped.warning.length > 0) {
    comment += `### ⚠️ Warnings (${grouped.warning.length})\n`;
    grouped.warning.forEach((issue) => {
      comment += `- **${issue.path}${issue.line ? `:${issue.line}` : ""}**: ${issue.comment}\n`;
    });
    comment += "\n";
  }

  if (grouped.info && grouped.info.length > 0) {
    comment += `### ℹ️ Info (${grouped.info.length})\n`;
    grouped.info.forEach((issue) => {
      comment += `- **${issue.path}${issue.line ? `:${issue.line}` : ""}**: ${issue.comment}\n`;
    });
    comment += "\n";
  }

  return comment;
}

/**
 * Main function to orchestrate code review
 */
async function runCodeReview() {
  const { owner, repo, pr } = parseArgs();

  console.log(`\n🚀 Starting code review for ${owner}/${repo} PR #${pr}...\n`);

  try {
    // Step 1: Fetch PR details (in real scenario, would use GitHub API)
    console.log("📥 Fetching PR details...");
    const prData = {
      owner,
      repo,
      number: pr,
      title: "Example PR",
      description: "This is a code review demonstration",
    };

    // Step 2: Simulate fetching changed files
    // In a real scenario, you would use the GitHub API to get actual changed files
    console.log("📂 Analyzing changed files...");
    const changedFiles = getExampleChangedFiles();

    // Step 3: Analyze each file
    const allIssues: ReviewIssue[] = [];
    const fileAnalyses: FileAnalysis[] = [];

    for (const file of changedFiles) {
      console.log(`   Analyzing: ${file.path}`);
      const issues = analyzeFile(file.path, file.content);
      allIssues.push(...issues);
      fileAnalyses.push({ file: file.path, issues });
    }

    // Step 4: Generate review summary
    const reviewComment = formatReviewComment(allIssues);

    // Step 5: Output results
    console.log("\n✅ Code review analysis complete!\n");
    console.log(reviewComment);

    // Step 6: Save review data for GitHub posting
    const reviewData = {
      pr: prData.number,
      owner: prData.owner,
      repo: prData.repo,
      comment: reviewComment,
      issues: allIssues,
      timestamp: new Date().toISOString(),
    };

    // Create .github/review-data directory if needed
    const reviewDir = path.join(process.cwd(), ".github", "review-data");
    if (!fs.existsSync(reviewDir)) {
      fs.mkdirSync(reviewDir, { recursive: true });
    }

    // Save review data
    const reviewFile = path.join(reviewDir, `review-pr-${prData.number}.json`);
    fs.writeFileSync(reviewFile, JSON.stringify(reviewData, null, 2));

    console.log(`📝 Review data saved to: ${reviewFile}`);
    console.log(`\nTo post this review to GitHub, run:`);
    console.log(`npm run post-review -- --pr=${prData.number}`);

    // Step 7: Fail if errors found (blocks merge with branch protection)
    const errorCount = allIssues.filter(
      (issue) => issue.severity === "error"
    ).length;
    if (errorCount > 0) {
      console.error(
        `\n❌ WORKFLOW FAILED: ${errorCount} error(s) found. Fix before merging.`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Code review failed:", error);
    process.exit(1);
  }
}

/**
 * Example function to simulate changed files
 * In production, this would call GitHub API
 */
function getExampleChangedFiles(): Array<{ path: string; content: string }> {
  return [
    {
      path: "src/App.tsx",
      content: `import React, { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  
  const handleClick = async () => {
    try {
      // TODO: Add proper error handling
      const response = await fetch('/api/data')
      console.log('Response:', response)
      setCount(count + 1)
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <div className="container">
      <button onClick={handleClick}>Click me ({count})</button>
    </div>
  )
}

export default App`,
    },
    {
      path: "src/index.css",
      content: `.container {
  width: 100%;
  padding: 20px !important;
  background-color: #f5f5f5;
}

button {
  padding: 10px 20px;
  background-color: blue !important;
  color: white;
}`,
    },
    {
      path: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}`,
    },
  ];
}

// Run the agent
runCodeReview().catch(console.error);
