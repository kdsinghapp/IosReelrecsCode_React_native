# Path Aliases Implementation Guide

## Problem Statement

The codebase has extensive deep relative imports that cause:
- **Fragility**: Hard to refactor - moving files breaks many imports
- **Readability**: Difficult to understand where imports come from
- **Maintenance**: `../../../../` makes code harder to navigate

### Impact Analysis
- **794 imports** with 3+ levels deep (`../../../`)
- **486 imports** with 4+ levels deep (`../../../../`)
- **35 imports** with 5+ levels deep (`../../../../../`)
- **Total: 1,315+ problematic imports**

---

## Solution: Path Aliases

We've implemented TypeScript path aliases and Babel module resolution to enable clean, absolute-style imports.

---

## 🎯 Available Aliases

| Alias | Maps To | Usage |
|-------|---------|-------|
| `@components/*` | `src/component/*` | Components, modals, cards |
| `@screens/*` | `src/screen/*` | All screen components |
| `@redux/*` | `src/redux/*` | Redux store, slices, APIs |
| `@utils/*` | `src/utils/*` | Utility functions |
| `@assets/*` | `src/assets/*` | Images, fonts, SVGs |
| `@theme/*` | `src/theme/*` | Colors, fonts, styles |
| `@types/*` | `src/types/*` | TypeScript type definitions |
| `@hooks/*` | `src/hook/*` | Custom React hooks |
| `@navigators/*` | `src/navigators/*` | Navigation configuration |
| `@services/*` | `src/services/*` | API services |
| `@routes/*` | `src/routes/*` | Route constants |

---

## Before & After Examples

### Example 1: Deep Component Import

**❌ Before** (5 levels deep):
```typescript
import { ButtonCustom } from '../../../../../component/common/button/ButtonCustom';
import { HeaderCustom } from '../../../../../component/common/header/HeaderCustom';
import { CustomStatusBar } from '../../../../../component';
```

**✅ After** (Clean):
```typescript
import { ButtonCustom } from '@components/common/button/ButtonCustom';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import { CustomStatusBar } from '@components';
```

---

### Example 2: Redux Imports

**❌ Before** (4 levels deep):
```typescript
import { RootState } from '../../../../redux/store';
import { getAllFriends } from '../../../../redux/Api/GroupApi';
import { useDispatch } from 'react-redux';
```

**✅ After** (Clean):
```typescript
import { RootState } from '@redux/store';
import { getAllFriends } from '@redux/Api/GroupApi';
import { useDispatch } from 'react-redux';
```

---

### Example 3: Utils & Theme

**❌ Before**:
```typescript
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';
import { validateString } from '../../../../utils/apiInputValidator';
```

**✅ After**:
```typescript
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { validateString } from '@utils/apiInputValidator';
```

---

### Example 4: Assets & Images

**❌ Before**:
```typescript
import imageIndex from '../../../../../assets/imageIndex';
import { ReelRecsLogo } from '../../../../../assets/svg/Logo';
```

**✅ After**:
```typescript
import imageIndex from '@assets/imageIndex';
import { ReelRecsLogo } from '@assets/svg/Logo';
```

---

### Example 5: Types & Hooks

**❌ Before**:
```typescript
import { Movie, UserProfile } from '../../../../types/api.types';
import { useBookmark } from '../../../../hook/useBookmark';
```

**✅ After**:
```typescript
import { Movie, UserProfile } from '@types/api.types';
import { useBookmark } from '@hooks/useBookmark';
```

---

## 📁 Real File Examples

### MovieDetailScreen.tsx

**Before:**
```typescript
import { RootState } from '../../../../redux/store';
import { getMovieMetadata } from '../../../../redux/Api/movieApi';
import { toggleBookmark } from '../../../../redux/Api/ProfileApi';
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';
import { CustomStatusBar } from '../../../../component';
import { HeaderCustom } from '../../../../component/common/header/HeaderCustom';
import ScreenNameEnum from '../../../../routes/screenName.enum';
```

**After:**
```typescript
import { RootState } from '@redux/store';
import { getMovieMetadata } from '@redux/Api/movieApi';
import { toggleBookmark } from '@redux/Api/ProfileApi';
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { CustomStatusBar } from '@components';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import ScreenNameEnum from '@routes/screenName.enum';
```

**Savings:** 8 lines cleaned, 40+ characters removed per import

---

### ProfileScreen.tsx

**Before:**
```typescript
import { getUserProfile } from '../../../../redux/Api/authService';
import { getOthereUsers } from '../../../../redux/Api/ProfileApi';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import { useBookmark } from '../../../../hook/useBookmark';
import { Color } from '../../../../theme/color';
```

**After:**
```typescript
import { getUserProfile } from '@redux/Api/authService';
import { getOthereUsers } from '@redux/Api/ProfileApi';
import { BASE_IMAGE_URL } from '@redux/Api/axiosInstance';
import { useBookmark } from '@hooks/useBookmark';
import { Color } from '@theme/color';
```

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install --save-dev babel-plugin-module-resolver
```

### 2. Configuration Files

Already configured:
- ✅ `tsconfig.json` - TypeScript path mapping
- ✅ `babel.config.js` - Runtime module resolution  
- ✅ `package.json` - Dependencies added

### 3. Clear Caches

After setup, clear all caches:

```bash
# Clear metro bundler cache
npm start -- --reset-cache

# Clear watchman (if using)
watchman watch-del-all

# Clean iOS build
cd ios && rm -rf Pods && pod install && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..
```

### 4. Restart IDE

Restart VSCode/editor to pick up new TypeScript paths:
1. Close all editor windows
2. Reopen project
3. Let TypeScript server reload

---

## 🔄 Migration Strategy

### Option 1: Gradual Migration (Recommended)
- Migrate files as you work on them
- Start with most frequently modified files
- Use path aliases for all NEW code immediately

### Option 2: Automated Migration
Use find-replace patterns (carefully!):

**Pattern for 4-level imports:**
```bash
# Example: Replace redux imports
Find:    from '../../../../redux/
Replace: from '@redux/
```

**Pattern for 5-level imports:**
```bash
# Example: Replace component imports
Find:    from '../../../../../component/
Replace: from '@components/
```

### Option 3: Targeted Migration

Priority files to migrate first:
1. **Screens** - Most imports, highest benefit
2. **Components** - Reused everywhere
3. **Hooks** - Custom hooks with many imports
4. **Redux slices** - Central to app logic

---

## 📊 Migration Checklist

### High Priority (Do First)
- [ ] `src/screen/BottomTab/` - All screen files
- [ ] `src/component/modal/` - Modal components
- [ ] `src/component/common/` - Shared components
- [ ] `src/redux/Api/` - API service files

### Medium Priority
- [ ] `src/component/card/` - Card components
- [ ] `src/navigators/` - Navigation files
- [ ] `src/hook/` - Custom hooks
- [ ] Style files (`style.ts`)

### Low Priority
- [ ] Test files
- [ ] One-off utility scripts
- [ ] Deprecated code

---

## 🎨 IDE Support

### VSCode Auto-Import

TypeScript will now suggest path aliases in autocomplete:

```typescript
// Start typing...
import { Button... 
// VSCode suggests: @components/common/button/ButtonCustom
```

### IntelliSense

Cmd/Ctrl + Click on imports will work correctly with aliases.

---

## ⚠️ Common Pitfalls

### 1. **Cache Issues**
**Problem:** Aliases not working after setup

**Solution:**
```bash
npm start -- --reset-cache
```

### 2. **IDE Not Recognizing Aliases**
**Problem:** Red squiggles under imports

**Solution:**
- Restart TypeScript server: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Reload VSCode window

### 3. **Jest Tests Failing**
**Problem:** Tests can't resolve aliases

**Solution:** Add to `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@components/(.*)$': '<rootDir>/src/component/$1',
  '^@screens/(.*)$': '<rootDir>/src/screen/$1',
  '^@redux/(.*)$': '<rootDir>/src/redux/$1',
  // ... add all aliases
}
```

### 4. **Android Build Failing**
**Problem:** Module not found errors

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
npx react-native run-android
```

---

## 🧪 Testing Path Aliases

Create a test file to verify aliases work:

```typescript
// src/test-aliases.ts
import { Color } from '@theme/color';
import { RootState } from '@redux/store';
import { CustomStatusBar } from '@components';
import ResponsiveSize from '@utils/ResponsiveSize';

console.log('✅ All aliases working!');
```

Run:
```bash
npx tsc --noEmit src/test-aliases.ts
```

If no errors → aliases configured correctly!

---

## 📈 Benefits

### Before
```typescript
// 120 characters, hard to read
import { getGroupMembers } from '../../../../../redux/Api/GroupApi';
```

### After
```typescript
// 60 characters, crystal clear
import { getGroupMembers } from '@redux/Api/GroupApi';
```

**Improvements:**
- ✅ **50% shorter** imports
- ✅ **Easier refactoring** - move files without updating imports
- ✅ **Better readability** - instantly know where code comes from
- ✅ **Consistent style** - all imports look uniform
- ✅ **IDE autocomplete** - better suggestions
- ✅ **Reduced errors** - fewer typos in path strings

---

## 🚀 Quick Reference

| Import Type | Old Pattern | New Pattern |
|-------------|-------------|-------------|
| Components | `../../../../component/` | `@components/` |
| Screens | `../../../../screen/` | `@screens/` |
| Redux | `../../../../redux/` | `@redux/` |
| Utils | `../../../../utils/` | `@utils/` |
| Theme | `../../../../theme/` | `@theme/` |
| Types | `../../../../types/` | `@types/` |
| Hooks | `../../../../hook/` | `@hooks/` |
| Assets | `../../../../assets/` | `@assets/` |

---

## 💡 Best Practices

1. **Always use aliases for new code**
2. **Migrate files when editing them**
3. **Be consistent** - don't mix relative and alias imports in same file
4. **Group imports** - aliases first, then relative, then node_modules
5. **Use index exports** - `@components` instead of `@components/index`

---

## Example: Full File Migration

### Before (HomeScreen.tsx)

```typescript
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getUserFeed } from '../../../../redux/Api/FeedApi';
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';
import { CustomStatusBar } from '../../../../component';
import { HeaderCustom } from '../../../../component/common/header/HeaderCustom';
import { FeedCard } from '../../../../component/card/feedCard/FeedCard';
import { useBookmark } from '../../../../hook/useBookmark';
import ScreenNameEnum from '../../../../routes/screenName.enum';
```

### After (HomeScreen.tsx)

```typescript
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { getUserFeed } from '@redux/Api/FeedApi';
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { CustomStatusBar } from '@components';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import { FeedCard } from '@components/card/feedCard/FeedCard';
import { useBookmark } from '@hooks/useBookmark';
import ScreenNameEnum from '@routes/screenName.enum';
```

**Result:** Clean, professional imports that are easy to maintain!

---

## 🎯 Next Steps

1. ✅ Configuration complete
2. ⏭️ Install dependencies: `npm install`
3. ⏭️ Clear caches
4. ⏭️ Test with one file
5. ⏭️ Gradually migrate existing imports
6. ⏭️ Use aliases for all new code

---

## Support

If you encounter issues:
1. Check cache clearing steps above
2. Verify `tsconfig.json` and `babel.config.js` are correct
3. Restart development server
4. Restart IDE/editor

**Happy coding with clean imports! 🚀**
