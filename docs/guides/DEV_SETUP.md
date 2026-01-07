# Developer Setup Guide

## Prerequisites
- Node.js ≥ 18
- Xcode 16.x (for iOS)
- CocoaPods (for iOS)
- React Native CLI

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Install iOS Pods
```bash
cd ios && pod install && cd ..
```

### 3. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your API credentials
```

## Development

### Type Check
```bash
npx tsc --noEmit
```

### Lint
```bash
npm run lint
npm run lint:fix  # Auto-fix
```

### Run iOS
```bash
npm run ios
```

### Run Android
```bash
npm run android
```

## Build Configuration

- **Static Linkage:** iOS uses static CocoaPods (no frameworks)
- **Swift Version:** 5.0 (forced in Podfile post_install)
- **New Architecture:** Disabled (RCT_NEW_ARCH_ENABLED=0)
- **Hermes:** Enabled

## Path Aliases

Use clean imports:
```typescript
import { X } from '@redux/store';      // Not ../../../redux/store
import { Y } from '@components/Button'; // Not ../../../../component/Button
```

Available aliases:
- `@components` → `src/component`
- `@screens` → `src/screen`
- `@redux` → `src/redux`
- `@hooks` → `src/hook`
- `@utils` → `src/utils`
- `@assets` → `src/assets`
- `@navigators` → `src/navigators`
- `@routes` → `src/routes`

## Troubleshooting

### iOS Build Fails
```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
cd ..
```

### Type Errors After Update
```bash
npx tsc --noEmit
# Fix errors shown
```

### Metro Cache Issues
```bash
npm start -- --reset-cache
```

### Reanimated Not Working
Ensure `react-native-reanimated/plugin` is the **last** plugin in `babel.config.js`, then:
```bash
npm start -- --reset-cache
```

## Key Dependencies

| Package | Version | Notes |
|---------|---------|-------|
| react-native | 0.77.2 | Latest stable |
| react-native-reanimated | 3.16.1 | Exact version (pinned) |
| react-native-screens | 3.37.0 | Exact version (pinned) |
| react-native-svg | 15.14.0 | Exact version (pinned) |

Versions are pinned to match tested Podfile.lock configurations.

## Code Quality

- **Strict TypeScript:** Enabled (`strict: true`)
- **ESLint:** TypeScript rules active
- **Redux:** Serialization checks enabled (except persist actions)
- **LogBox:** Only 2 specific warnings suppressed

## Git Workflow

1. Create feature branch from `main`
2. Run `npx tsc --noEmit` before committing
3. Run `npm run lint` before committing
4. Write clear commit messages
5. Create PR to `main`
