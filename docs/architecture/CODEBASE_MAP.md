# Codebase Map - ReelRecs Frontend
## Complete File Structure & Purpose Guide
### Date: November 1, 2025

---

## 📂 Project Root Structure

```
/Users/willi/Dev/frontend/
├── src/                    # All application source code
├── ios/                    # iOS-specific native code and configs
├── android/                # Android-specific (not currently used)
├── node_modules/           # Dependencies
├── package.json            # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── metro.config.js        # Metro bundler configuration
├── .watchmanconfig        # Watchman file watcher config
└── Documentation Files:
    ├── COMPLETE_PROJECT_CONTEXT.md
    ├── PAIRWISE_DEBUG_SESSION.md
    ├── DEBUGGING_GUIDE.md
    ├── CURRENT_BUG_STATUS.md
    └── CODEBASE_MAP.md (this file)
```

---

## 🎯 Critical Files for Ranking System

### Core Ranking Logic
```
src/screen/BottamTab/ranking/rankingScreen/
├── useCompareComponent.tsx     [PRIMARY - Binary search & state management]
├── CompareModals.tsx           [Orchestrates modal flow]
└── MovieDetailScreen.tsx       [Movie details view]
```

### Modal Components
```
src/component/modal/
├── comparisonModal/
│   └── ComparisonModal.tsx    [CRITICAL - Shows A vs B comparison]
├── CommentModal/
│   └── CommentModal.tsx       [User comments/notes]
├── FeedbackModal/
│   └── FeedbackModal.tsx      [Initial preference selection]
└── StepProgressModal/
    └── StepProgressModal.tsx  [Progress indicator]
```

---

## 📁 Detailed File Purposes

### `/src/screen/BottamTab/ranking/rankingScreen/useCompareComponent.tsx`
**Purpose**: Core hook managing the entire ranking logic
- **Lines 50-194**: `fetchComparisonMovies()` - Fetches movies from API
- **Lines 156-174**: Binary search initialization
- **Lines 196-218**: `secondMovieData` computation
- **Lines 331-401**: `handleSelectFirst()` - User prefers new movie
- **Lines 404-471**: `handleSelectSecond()` - User prefers comparison movie
- **Key State**: `mid`, `low`, `high`, `comparisonMovies`

### `/src/component/modal/comparisonModal/ComparisonModal.tsx`
**Purpose**: UI component for pairwise comparison
- **Lines 49-61**: Component props interface
- **Lines 242-256**: First movie selection handler
- **Lines 298-323**: Second movie selection handler
- **Lines 134-154**: Animation logic (`slideAndResetImages`)
- **Key Issue**: Shows same movie repeatedly (current bug)

### `/src/screen/BottamTab/ranking/rankingScreen/CompareModals.tsx`
**Purpose**: Modal orchestration and state coordination
- **Line 133**: Conditional rendering logic
- **Lines 146-159**: Props passing to ComparisonModal
- **Lines 101-130**: FeedbackModal rendering
- **Lines 172-186**: StepProgressModal rendering

---

## 🔧 Utility Files

### `/src/utils/FileLogger.tsx`
**Purpose**: Custom logging system for debugging
- Writes to: `/Documents/app_debug_logs.txt`
- Methods: `info()`, `error()`, `warn()`
- Persists through app crashes

### `/src/utils/PopupLogger.ts`
**Purpose**: Alternative logging for popups/modals

### `/src/component/ErrorBoundary.tsx`
**Purpose**: React error boundary
- Catches render errors
- Prevents app crashes
- Logs errors to FileLogger

---

## 🎨 UI Components

### Common Components
```
src/component/common/
├── CustomText.tsx          # Standardized text component
├── Button.tsx             # Reusable button
└── LoadingIndicator.tsx   # Loading spinner
```

### Ranking Components
```
src/component/ranking/
├── RankingCard.tsx        # Individual ranking display
├── RankingWithInfo.tsx    # Ranking with tooltip
└── RankingList.tsx        # List of rankings
```

---

## 🗂️ Redux Store

### Store Structure
```
src/redux/
├── store.ts               # Store configuration
└── feature/
    └── modalSlice/
        └── modalSlice.ts  # Modal visibility states
```

### Key Slices
- `modalSlice`: Controls which modals are visible
- User preference state (stored in component state currently)

---

## 🎨 Theme & Assets

### Theme Files
```
src/theme/
├── color.ts               # Color constants (Color.primary, etc.)
├── font.ts                # Font definitions (font.PoppinsBold, etc.)
└── spacing.ts             # Layout spacing constants
```

### Assets
```
src/assets/
├── imageIndex.ts          # Image imports centralized
└── images/                # Actual image files
    ├── icons/
    └── backgrounds/
```

---

## 📱 iOS Native Files

### Key iOS Files
```
ios/
├── ReelRece.xcworkspace   # Xcode workspace (OPEN THIS in Xcode)
├── ReelRece.xcodeproj     # Xcode project
├── Podfile                # CocoaPods dependencies
├── Pods/                  # Installed pods
└── ReelRece/
    ├── Info.plist         # App configuration
    ├── AppDelegate.mm     # App lifecycle
    └── LaunchScreen.storyboard
```

---

## 🔌 API Integration

### API Service Files (Inferred)
```
src/services/           # (Location may vary)
├── api.ts             # Base API configuration
├── movieService.ts    # Movie-related API calls
└── userService.ts     # User preferences/auth
```

### Key API Functions
- `getAllRated_with_preference(token, preference)`
- `recordUserPreferences(token, preference, movie1, movie2, winner)`
- `calculateMovieRating(token, { imdb_id, preference })`

---

## 📊 Data Flow

### Movie Ranking Flow
1. **MovieDetailScreen** → User clicks "Rank Now"
2. **FeedbackModal** → Select preference (love/good/okay/bad)
3. **useCompareComponent** → Fetches comparison movies
4. **ComparisonModal** → Shows pairwise comparisons
5. **Binary Search** → Narrows down exact position
6. **StepProgressModal** → Shows completion

### State Flow
```
User Action → Component State → Redux (if needed) → API Call → Update State → Re-render
```

---

## 🔍 Where to Find Things

### Need to change ranking logic?
→ `/src/screen/BottamTab/ranking/rankingScreen/useCompareComponent.tsx`

### Need to fix modal UI?
→ `/src/component/modal/comparisonModal/ComparisonModal.tsx`

### Need to add logging?
→ Import from `/src/utils/FileLogger.tsx`

### Need to check Redux state?
→ `/src/redux/feature/modalSlice/modalSlice.ts`

### Need to modify API calls?
→ Look for service files or search for function names

### Need to change colors/fonts?
→ `/src/theme/color.ts` and `/src/theme/font.ts`

---

## 🚨 Files with Known Issues

### Files Recently Modified (November 1, 2025)
1. **ComparisonModal.tsx** - Removed JSX comments, added logging
2. **useCompareComponent.tsx** - Added extensive logging
3. **CompareModals.tsx** - Added ErrorBoundary wrapping
4. **FeedbackModal.tsx** - Fixed missing semicolon

### Files That Need Attention
1. **useCompareComponent.tsx** - Binary search logic needs verification
2. **ComparisonModal.tsx** - Modal not updating correctly (current bug)

---

## 📝 Configuration Files

### Package.json Key Scripts
```json
{
  "scripts": {
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

### Metro Config
`metro.config.js` - Bundler configuration

### TypeScript Config
`tsconfig.json` - Type checking settings

---

## 🔗 Navigation Structure

### Navigation Stack
```
Root Navigator
├── Auth Stack (if not logged in)
│   ├── Login
│   └── Register
└── Main Tab Navigator (if logged in)
    ├── Home Tab
    ├── Ranking Tab ← [Current focus area]
    ├── Profile Tab
    └── Settings Tab
```

---

## 💡 Quick Reference

### Most Important Files for Current Bug
1. `useCompareComponent.tsx` - Lines 156-174, 331-471
2. `ComparisonModal.tsx` - Lines 298-323
3. `app_debug_logs.txt` - Check simulator Documents

### To Add New Feature
1. Create component in `/src/component/`
2. Add screen in `/src/screen/`
3. Update navigation if needed
4. Add to Redux if state is global

### To Debug
1. Add logging with FileLogger
2. Check `/Documents/app_debug_logs.txt`
3. Use ErrorBoundary for catching errors
4. Check simulator native logs

---

## 📌 File Naming Conventions

- **Components**: PascalCase (e.g., `ComparisonModal.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useCompareComponent.tsx`)
- **Utils**: camelCase (e.g., `fileLogger.tsx`)
- **Types**: PascalCase with 'Type' or 'Interface' suffix
- **Constants**: UPPER_SNAKE_CASE

---

This map should help any developer quickly understand where to find specific functionality and how the codebase is organized.