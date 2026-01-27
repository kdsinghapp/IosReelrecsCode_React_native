#!/usr/bin/env node

/**
 * Import Migration Script
 * 
 * Converts deep relative imports to path aliases
 * 
 * Usage:
 *   node scripts/migrate-imports.js src/screen/BottomTab/home/HomeScreen.tsx
 *   node scripts/migrate-imports.js src/screen/BottomTab/
 *   node scripts/migrate-imports.js src/component/
 */

const fs = require('fs');
const path = require('path');

// Define import replacements
const replacements = [
  // 6+ levels deep
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/redux\//g, replacement: "from '@redux/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/component\//g, replacement: "from '@components/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/screen\//g, replacement: "from '@screens/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/utils\//g, replacement: "from '@utils/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/theme\//g, replacement: "from '@theme/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/assets\//g, replacement: "from '@assets/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/types\//g, replacement: "from '@types/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/hook\//g, replacement: "from '@hooks/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/navigators\//g, replacement: "from '@navigators/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/services\//g, replacement: "from '@services/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/routes\//g, replacement: "from '@routes/" },

  // 5 levels deep
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/redux\//g, replacement: "from '@redux/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/component\//g, replacement: "from '@components/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/screen\//g, replacement: "from '@screens/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/utils\//g, replacement: "from '@utils/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/theme\//g, replacement: "from '@theme/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/assets\//g, replacement: "from '@assets/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/types\//g, replacement: "from '@types/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/hook\//g, replacement: "from '@hooks/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/navigators\//g, replacement: "from '@navigators/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/services\//g, replacement: "from '@services/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/routes\//g, replacement: "from '@routes/" },

  // 4 levels deep
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/redux\//g, replacement: "from '@redux/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/component\//g, replacement: "from '@components/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/screen\//g, replacement: "from '@screens/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/utils\//g, replacement: "from '@utils/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/theme\//g, replacement: "from '@theme/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/assets\//g, replacement: "from '@assets/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/types\//g, replacement: "from '@types/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/hook\//g, replacement: "from '@hooks/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/navigators\//g, replacement: "from '@navigators/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/services\//g, replacement: "from '@services/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/\.\.\/routes\//g, replacement: "from '@routes/" },

  // 3 levels deep
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/redux\//g, replacement: "from '@redux/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/component\//g, replacement: "from '@components/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/screen\//g, replacement: "from '@screens/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/utils\//g, replacement: "from '@utils/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/theme\//g, replacement: "from '@theme/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/assets\//g, replacement: "from '@assets/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/types\//g, replacement: "from '@types/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/hook\//g, replacement: "from '@hooks/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/navigators\//g, replacement: "from '@navigators/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/services\//g, replacement: "from '@services/" },
  { pattern: /from ['"]\.\.\/\.\.\/\.\.\/routes\//g, replacement: "from '@routes/" },
];

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    let changeCount = 0;

    // Apply all replacements
    replacements.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        changed = true;
        changeCount += matches.length;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Migrated ${changeCount} imports in: ${filePath}`);
      return changeCount;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

function migrateDirectory(dirPath) {
  let totalChanges = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build folders
        if (!['node_modules', 'build', 'dist', '.git'].includes(item)) {
          totalChanges += migrateDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Only process .ts, .tsx, .js, .jsx files
        if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          totalChanges += migrateFile(fullPath);
        }
      }
    });
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
  
  return totalChanges;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
📦 Import Migration Script

Usage:
  node scripts/migrate-imports.js <file-or-directory>

Examples:
  # Single file
  node scripts/migrate-imports.js src/screen/BottomTab/home/HomeScreen.tsx
  
  # Entire directory
  node scripts/migrate-imports.js src/screen/BottomTab/
  
  # Multiple files
  node scripts/migrate-imports.js src/component/common/*.tsx

⚠️  WARNING: This script modifies files in place!
   Make sure you have committed your changes or have a backup.
  `);
  process.exit(1);
}

console.log('\n🚀 Starting import migration...\n');

let totalChanges = 0;

args.forEach(target => {
  try {
    const stat = fs.statSync(target);
    
    if (stat.isDirectory()) {
      console.log(`📁 Processing directory: ${target}\n`);
      totalChanges += migrateDirectory(target);
    } else if (stat.isFile()) {
      console.log(`📄 Processing file: ${target}\n`);
      totalChanges += migrateFile(target);
    }
  } catch (error) {
    console.error(`❌ Error: ${target} not found or inaccessible`);
  }
});

console.log(`\n✨ Migration complete! Changed ${totalChanges} imports.`);

if (totalChanges > 0) {
  console.log(`
📝 Next steps:
  1. Review the changes (git diff)
  2. Test that the app still builds
  3. Commit the changes
  
💡 Tip: Clear Metro cache after migration:
   npm start -- --reset-cache
  `);
}
