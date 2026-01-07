# Debugging Guide for ReelRecs
## Essential Tools & Techniques for React Native Debugging
### Date: November 1, 2025

---

## 🔧 Custom Debugging Infrastructure

### 1. FileLogger System (Our Primary Tool)

We built a custom file-based logging system because the app was crashing and console logs were being lost. This is YOUR MOST IMPORTANT DEBUGGING TOOL.

#### Location
`/src/utils/FileLogger.tsx`

#### How to Use
```javascript
import { fileLogger } from '../utils/FileLogger';

// In any component
fileLogger.info('[ComponentName] Action happening', {
  data: someData,
  state: someState
});

fileLogger.error('[ComponentName] Error occurred', error);

fileLogger.warn('[ComponentName] Warning', { details });
```

#### Reading Logs

**Step 1: Find the log file path**
```bash
# The log file is always at this path in the simulator:
/Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/[APP_ID]/Documents/app_debug_logs.txt
```

**Step 2: Find the current APP_ID**
```bash
# List all app containers (newest is usually the current one)
ls -lat /Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/
```

**Step 3: Read the logs**
```bash
# Use the Read tool with the full path
Read("/Users/willi/Library/Developer/CoreSimulator/Devices/9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8/data/Containers/Data/Application/039CA727-7B38-4D74-BA25-EDA0F7320233/Documents/app_debug_logs.txt")
```

#### Why FileLogger Over Console.log?
- **Persists through crashes** - Logs are written to disk immediately
- **Survives app restarts** - File remains on simulator filesystem
- **Easy to search** - Can grep through the file for patterns
- **Timestamps included** - Every log has ISO timestamp
- **Structured data** - Logs JSON data for easy parsing

---

## 🛡️ Error Boundaries

### Purpose
Catch React render errors without crashing the entire app.

### Implementation
```jsx
// Already wrapped around each modal
<ErrorBoundary name="ComparisonModal">
  <ComparisonModal ... />
</ErrorBoundary>
```

### Location
`/src/component/ErrorBoundary.tsx`

### What It Does
- Catches JavaScript errors in child component tree
- Logs error details to FileLogger
- Shows fallback UI instead of white screen
- Prevents app crash cascade

---

## 📱 Simulator Commands

### Essential Commands

#### Start Fresh
```bash
# Kill everything and start clean
lsof -ti:8081 | xargs kill -9
watchman watch-del-all
cd ios && pod cache clean --all && pod install
cd .. && npx react-native start --reset-cache
```

#### Run the App
```bash
# Terminal 1: Metro bundler
npx react-native start --reset-cache

# Terminal 2: iOS Simulator
npx react-native run-ios --simulator="iPhone 16 Pro"
```

#### View Native Logs
```bash
# Stream simulator logs
xcrun simctl spawn 9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8 log stream --process ReelRece
```

#### Clear Simulator Data
```bash
# Reset specific app
xcrun simctl uninstall 9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8 com.reelrece.app

# Full simulator reset
xcrun simctl erase 9BC3DAD1-9E9F-4DAC-B2B4-71F118C2C4B8
```

---

## 🐛 Common React Native Issues & Solutions

### 1. "Text strings must be rendered within a <Text> component"

**Symptoms**: App crashes with this error message

**Common Causes**:
- JSX comments inside render methods `{/* comment */}`
- Conditional rendering returning strings directly
- Spaces or newlines between components
- Numbers not converted to strings

**Solution**:
```javascript
// BAD
<View>{someNumber}</View>
<View>{/* This comment causes crash */}</View>
<View>
  {condition && "This string crashes"}
</View>

// GOOD
<View><Text>{String(someNumber)}</Text></View>
<View></View> {/* Comment outside */}
<View>
  {condition && <Text>This works</Text>}
</View>
```

### 2. NaN Display Issues

**Symptoms**: Progress bars or numbers showing "NaN"

**Solution**:
```javascript
// Safe calculation with fallback
const percentage = isNaN(calculated) ? 0 : calculated;
const safeNumber = Number(value) || 0;
```

### 3. Modal Not Updating Props

**Symptoms**: Modal shows stale data despite prop changes

**Common Causes**:
- Stale closures in setTimeout/animations
- Component not re-rendering
- useMemo with wrong dependencies

**Debugging Steps**:
1. Add prop logging in useEffect
2. Check if component unmounts/remounts
3. Verify parent state actually changes
4. Look for setTimeout capturing old values

---

## 🔍 Debugging Workflow

### Step 1: Reproduce the Bug
1. Document exact steps
2. Note what you expect vs what happens
3. Check if it's consistent

### Step 2: Add Strategic Logging
```javascript
// At component mount
useEffect(() => {
  fileLogger.info('[Component] Mounted');
  return () => fileLogger.info('[Component] Unmounted');
}, []);

// On prop changes
useEffect(() => {
  fileLogger.info('[Component] Props changed', { props });
}, [criticalProp]);

// Before state updates
fileLogger.info('[Component] About to update state', {
  oldState: state,
  newValue: value
});
```

### Step 3: Read and Analyze Logs
1. Find the last successful operation
2. Look for the first error or unexpected value
3. Check timestamps for delays
4. Compare actual vs expected values

### Step 4: Test Hypotheses
- Comment out suspicious code
- Add more granular logging
- Simplify complex operations
- Remove animations temporarily

---

## 📊 State Debugging

### Redux DevTools
```javascript
// Check Redux state
console.log('Redux state:', store.getState());
```

### Component State
```javascript
// Log all state in render
fileLogger.info('[Component] Render state', {
  state1,
  state2,
  props
});
```

### AsyncStorage Debugging
```javascript
// Save debug data
AsyncStorage.setItem('DEBUG_DATA', JSON.stringify(data));

// Read debug data
const debug = await AsyncStorage.getItem('DEBUG_DATA');
console.log('Stored:', JSON.parse(debug));
```

---

## 🚨 Emergency Procedures

### App Won't Build
```bash
# Nuclear option - clean everything
rm -rf node_modules
rm -rf ios/Pods
npm install
cd ios && pod install
cd .. && npx react-native start --reset-cache
```

### Metro Bundler Stuck
```bash
# Kill and restart
lsof -ti:8081 | xargs kill -9
npx react-native start --reset-cache
```

### Simulator Frozen
```bash
# Force quit simulator
killall Simulator
# Restart
open -a Simulator
```

---

## 💡 Pro Tips

1. **Always use FileLogger** - Console.log gets lost in crashes
2. **Log before and after** - Async operations especially
3. **Include context** - Component name, action, data
4. **Use structured data** - Objects are better than strings
5. **Clean logs periodically** - File can get large
6. **Test incrementally** - Small changes, test often
7. **Backup working code** - Before major changes
8. **Read error carefully** - Stack trace has clues
9. **Check simulator logs** - Native errors appear there
10. **When stuck, restart everything** - Seriously, it helps

---

## 🔗 Related Documentation

- `CURRENT_BUG_STATUS.md` - Active issues being debugged
- `COMPLETE_PROJECT_CONTEXT.md` - Overall project understanding
- `PAIRWISE_DEBUG_SESSION.md` - Specific bug investigation
- `COMMON_PITFALLS.md` - React Native gotchas

---

## 📝 Logging Best Practices

### What to Log
- Component lifecycle (mount/unmount)
- State changes
- API calls and responses
- User interactions
- Error conditions
- Prop updates
- Navigation events

### How to Structure Logs
```javascript
fileLogger.info('[ComponentName] ActionDescription', {
  // Include relevant context
  input: userInput,
  state: currentState,
  props: relevantProps,
  timestamp: Date.now(),
  // Be specific
  movieId: movie.imdb_id,
  movieTitle: movie.title
});
```

### Log Levels
- `info` - Normal operations
- `warn` - Potential issues
- `error` - Definite problems
- Use consistently for easier filtering

---

## Remember

The FileLogger is your best friend. When the app crashes, the logs survive. Always check the logs first before making assumptions about what's wrong.