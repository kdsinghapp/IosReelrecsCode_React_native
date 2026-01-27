# Path Aliases - Real File Examples

## Example 1: MovieDetailScreen.tsx

### Before (With Deep Relative Imports)

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

// ❌ Deep relative imports (5 levels!)
import { RootState } from '../../../../redux/store';
import { getMovieMetadata } from '../../../../redux/Api/movieApi';
import { toggleBookmark } from '../../../../redux/Api/ProfileApi';
import { getMoviePlatforms } from '../../../../redux/Api/ProfileApi';
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';
import { CustomStatusBar } from '../../../../component';
import { HeaderCustom } from '../../../../component/common/header/HeaderCustom';
import { ButtonCustom } from '../../../../component/common/button/ButtonCustom';
import ScreenNameEnum from '../../../../routes/screenName.enum';
import { Movie } from '../../../../types/api.types';
```

**Issues:**
- 11 imports with `../../../../`
- 605+ characters in import paths
- Hard to understand file structure
- Fragile - breaks when moving files

### After (With Path Aliases)

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

// ✅ Clean path aliases
import { RootState } from '@redux/store';
import { getMovieMetadata } from '@redux/Api/movieApi';
import { toggleBookmark, getMoviePlatforms } from '@redux/Api/ProfileApi';
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { CustomStatusBar } from '@components';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import { ButtonCustom } from '@components/common/button/ButtonCustom';
import ScreenNameEnum from '@routes/screenName.enum';
import { Movie } from '@types/api.types';
```

**Improvements:**
- **50% shorter** imports
- **Instantly clear** where imports come from
- **Easy to refactor** - move file anywhere
- **Professional appearance**

---

## Example 2: ProfileScreen.tsx

### Before

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// ❌ Deep imports everywhere
import { RootState } from '../../../../redux/store';
import { getUserProfile } from '../../../../redux/Api/authService';
import { getOthereUsers } from '../../../../redux/Api/ProfileApi';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import { useBookmark } from '../../../../hook/useBookmark';
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';
import { CustomStatusBar } from '../../../../component';
import { HeaderCustom } from '../../../../component/common/header/HeaderCustom';
import { ProfileCard } from '../../../../component/card/profileCard/ProfileCard';
import ScreenNameEnum from '../../../../routes/screenName.enum';
```

### After

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// ✅ Clean and organized
import { RootState } from '@redux/store';
import { getUserProfile } from '@redux/Api/authService';
import { getOthereUsers } from '@redux/Api/ProfileApi';
import { BASE_IMAGE_URL } from '@redux/Api/axiosInstance';
import { useBookmark } from '@hooks/useBookmark';
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { CustomStatusBar } from '@components';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import { ProfileCard } from '@components/card/profileCard/ProfileCard';
import ScreenNameEnum from '@routes/screenName.enum';
```

---

## Example 3: WatchScreen.tsx

### Before

```typescript
// ❌ Nightmare of deep imports
import { RootState } from '../../../../redux/store';
import { getAllGroups } from '../../../../redux/Api/GroupApi';
import { BASE_IMAGE_URL } from '../../../../redux/Api/axiosInstance';
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';
import { CustomStatusBar } from '../../../../component';
import { HeaderCustom } from '../../../../component/common/header/HeaderCustom';
import { WatchGroupCom } from '../../../../component/common/WatchGroupCom/WatchGroupCom';
import { InviteModal } from '../../../../component/modal/inviteModal/InviteModal';
import ScreenNameEnum from '../../../../routes/screenName.enum';
```

### After

```typescript
// ✅ Much cleaner
import { RootState } from '@redux/store';
import { getAllGroups } from '@redux/Api/GroupApi';
import { BASE_IMAGE_URL } from '@redux/Api/axiosInstance';
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { CustomStatusBar } from '@components';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import { WatchGroupCom } from '@components/common/WatchGroupCom/WatchGroupCom';
import { InviteModal } from '@components/modal/inviteModal/InviteModal';
import ScreenNameEnum from '@routes/screenName.enum';
```

---

## Example 4: Modal Component

### Before

```typescript
// ❌ Even modals have deep imports
import { Color } from '../../../theme/color';
import ResponsiveSize from '../../../utils/ResponsiveSize';
import { ButtonCustom } from '../../../component/common/button/ButtonCustom';
import { InputFieldCustom } from '../../../component/common/inputField/InputFieldCustom';
import { RootState } from '../../../redux/store';
import { createGroup } from '../../../redux/Api/GroupApi';
```

### After

```typescript
// ✅ Cleaner modal imports
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { ButtonCustom } from '@components/common/button/ButtonCustom';
import { InputFieldCustom } from '@components/common/inputField/InputFieldCustom';
import { RootState } from '@redux/store';
import { createGroup } from '@redux/Api/GroupApi';
```

---

## Example 5: Custom Hook

### Before

```typescript
// hooks/useBookmark.tsx
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

// ❌ Relative imports from hooks folder
import { RootState } from '../../redux/store';
import { toggleBookmark as toggleBookmarkAPI } from '../../redux/Api/ProfileApi';
import { Movie } from '../../types/api.types';
```

### After

```typescript
// hooks/useBookmark.tsx
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

// ✅ Clear path aliases
import { RootState } from '@redux/store';
import { toggleBookmark as toggleBookmarkAPI } from '@redux/Api/ProfileApi';
import { Movie } from '@types/api.types';
```

---

## Example 6: Deeply Nested Component

### Before (Worst Case - 6 levels!)

```typescript
// components/modal/groupMovieModal/groupMovieModal.tsx

// ❌ This is unreadable
import { Color } from '../../../../../theme/color';
import ResponsiveSize from '../../../../../utils/ResponsiveSize';
import { RootState } from '../../../../../redux/store';
import { getGroupSearchMovies } from '../../../../../redux/Api/GroupApi';
import { Movie } from '../../../../../types/api.types';
import { ButtonCustom } from '../../../../../component/common/button/ButtonCustom';
```

### After

```typescript
// components/modal/groupMovieModal/groupMovieModal.tsx

// ✅ Professional and clear
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
import { RootState } from '@redux/store';
import { getGroupSearchMovies } from '@redux/Api/GroupApi';
import { Movie } from '@types/api.types';
import { ButtonCustom } from '@components/common/button/ButtonCustom';
```

---

## Grouped Import Organization

### Recommended Import Order

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. Redux (state management)
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/store';
import { getUserData } from '@redux/Api/authService';

// 3. Components
import { CustomStatusBar } from '@components';
import { HeaderCustom } from '@components/common/header/HeaderCustom';
import { FeedCard } from '@components/card/feedCard/FeedCard';

// 4. Utilities & Theme
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';

// 5. Types & Constants
import { Movie, User } from '@types/api.types';
import ScreenNameEnum from '@routes/screenName.enum';

// 6. Relative imports (if any - avoid if possible)
import { localHelper } from './helpers';
import styles from './styles';
```

---

## Migration Commands

### Migrate a Single File

```bash
node scripts/migrate-imports.js src/screen/BottomTab/home/HomeScreen.tsx
```

### Migrate an Entire Directory

```bash
# All screens
node scripts/migrate-imports.js src/screen/

# All components
node scripts/migrate-imports.js src/component/

# All modals
node scripts/migrate-imports.js src/component/modal/
```

### Migrate Multiple Directories

```bash
node scripts/migrate-imports.js \
  src/screen/BottomTab/ \
  src/component/modal/ \
  src/component/common/
```

---

## Testing After Migration

### 1. Check TypeScript

```bash
npx tsc --noEmit
```

No errors = All imports resolve correctly ✅

### 2. Clear Caches

```bash
npm start -- --reset-cache
```

### 3. Build & Test

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Common Patterns

### Pattern 1: Redux Store Access

```typescript
// ❌ Before
import { RootState } from '../../../../redux/store';

// ✅ After
import { RootState } from '@redux/store';
```

### Pattern 2: Component Imports

```typescript
// ❌ Before
import { HeaderCustom } from '../../../../../component/common/header/HeaderCustom';

// ✅ After
import { HeaderCustom } from '@components/common/header/HeaderCustom';
```

### Pattern 3: API Calls

```typescript
// ❌ Before
import { getMovieMetadata } from '../../../../redux/Api/movieApi';

// ✅ After
import { getMovieMetadata } from '@redux/Api/movieApi';
```

### Pattern 4: Theme & Utils

```typescript
// ❌ Before
import { Color } from '../../../../theme/color';
import ResponsiveSize from '../../../../utils/ResponsiveSize';

// ✅ After
import { Color } from '@theme/color';
import ResponsiveSize from '@utils/ResponsiveSize';
```

---

## Statistics

### Character Count Reduction

**Average import before:** `from '../../../../redux/store'` = 38 chars  
**Average import after:** `from '@redux/store'` = 20 chars  
**Savings:** **47% shorter**

### Typical File Savings

- **10 imports** = 180 characters saved
- **20 imports** = 360 characters saved
- **30 imports** = 540 characters saved

### Codebase-wide Impact

- **1,315 deep imports** found
- **~50,000 characters** could be saved
- **Better readability** = priceless ✨

---

## Tips

1. **Always use aliases for new code**
2. **Migrate files when you edit them**
3. **Group imports logically** (see order above)
4. **Be consistent** throughout the file
5. **Commit often** during migration

---

## Next Steps

1. ✅ Configuration is done
2. ⏭️ Install dependencies: `npm install`
3. ⏭️ Clear caches
4. ⏭️ Test with one file
5. ⏭️ Use migration script for bulk updates
6. ⏭️ Use aliases for all new code

**See:** `PATH_ALIASES_GUIDE.md` for complete documentation
