#!/usr/bin/env node

/**
 * Security Check Script for Marisca
 * Verifies that no sensitive data is committed to the repository
 */

const fs = require('fs');
const path = require('path');

// Patterns to check for sensitive data
const SENSITIVE_PATTERNS = [
  {
    name: 'Supabase URL',
    pattern: /https:\/\/[a-zA-Z0-9]+\.supabase\.co/,
    message: 'Supabase URL found - should be in environment variables'
  },
  {
    name: 'Supabase Anon Key',
    pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/,
    message: 'Supabase Anon Key found - should be in environment variables'
  },
  {
    name: 'Stripe Secret Key',
    pattern: /sk_[a-zA-Z0-9]{24,}/,
    message: 'Stripe Secret Key found - should be in environment variables'
  },
  {
    name: 'Stripe Publishable Key',
    pattern: /pk_[a-zA-Z0-9]{24,}/,
    message: 'Stripe Publishable Key found - should be in environment variables'
  },
  {
    name: 'Database Password',
    pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/i,
    message: 'Potential database password found'
  }
];

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.env\.example/,
  /scripts\/security-check\.js/
];

function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    SENSITIVE_PATTERNS.forEach(({ name, pattern, message }) => {
      if (pattern.test(content)) {
        issues.push({
          file: filePath,
          issue: name,
          message: message
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    return [];
  }
}

function scanDirectory(dirPath) {
  let allIssues = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      if (shouldExcludeFile(fullPath)) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        allIssues = allIssues.concat(scanDirectory(fullPath));
      } else if (stat.isFile() && /\.(js|ts|tsx|jsx|json|toml)$/.test(item)) {
        allIssues = allIssues.concat(scanFile(fullPath));
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}: ${error.message}`);
  }
  
  return allIssues;
}

function main() {
  console.log('🔍 Running security check...\n');
  
  const issues = scanDirectory('.');
  
  if (issues.length === 0) {
    console.log('✅ No security issues found!');
    process.exit(0);
  }
  
  console.log(`❌ Found ${issues.length} security issue(s):\n`);
  
  issues.forEach(({ file, issue, message }) => {
    console.log(`  📁 ${file}`);
    console.log(`     🚨 ${issue}: ${message}\n`);
  });
  
  console.log('💡 Recommendations:');
  console.log('   - Move sensitive data to environment variables');
  console.log('   - Update .env.example with placeholder values');
  console.log('   - Ensure .env files are in .gitignore');
  
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { scanFile, scanDirectory, SENSITIVE_PATTERNS };
