# Common Pitfalls in React Native Development
## Lessons Learned from ReelRecs Debugging
### Date: November 1, 2025

---

## 🚨 Critical React Native Issues

### 1. JSX Comments Causing Crashes

#### The Problem
```javascript
// THIS WILL CRASH YOUR APP
<View>
  {/* This innocent comment causes: "Text strings must be rendered within a <Text> component" */}
  <SomeComponent />
</View>
```

#### Why It Happens
React Native's renderer treats JSX comments as potential text nodes. During compilation, `{/* comment */}` might leave behind whitespace or get interpreted as a string.

#### The Solution
```javascript
// SAFE: Comments outside JSX
<View>
  <SomeComponent />
</View>
{/* Or comment here, outside the component tree */}

// SAFER: Use regular JS comments above the JSX
// This is a comment about the component
<View>
  <SomeComponent />
</View>
```

#### Real Example from ReelRecs
We spent HOURS debugging crashes because of JSX comments in ComparisonModal.tsx. The error message was misleading - it said "Text strings must be rendered within a <Text> component" but the real cause was JSX comments.

---

### 2. Text Rendering Errors

#### The Problem
```javascript
// THESE WILL ALL CRASH
<View>Some text</View>           // Bare text
<View>{someNumber}</View>        // Unrendered number
<View>{condition && "text"}</View> // Conditional string
<View> </View>                   // Just a space!
```

#### Why It Happens
React Native requires ALL text to be wrapped in `<Text>` components. This includes:
- Literal strings
- Numbers
- Spaces between components
- Conditional renders that return strings

#### The Solution
```javascript
// ALWAYS wrap text
<View><Text>Some text</Text></View>
<View><Text>{String(someNumber)}</Text></View>
<View>{condition && <Text>text</Text>}</View>
<View></View> // No spaces!
```

#### Pro Tip
```javascript
// Create a safe render helper
const safeRender = (value) => {
  if (value === null || value === undefined) return null;
  return <Text>{String(value)}</Text>;
};
```

---

### 3. Stale Closures in Callbacks

#### The Problem
```javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setTimeout(() => {
    console.log(count); // This will log OLD value!
    doSomething(count); // Uses stale value
  }, 1000);
};
```

#### Why It Happens
JavaScript closures capture variables by reference. In React, when state changes, the component re-renders but callbacks created in previous renders still reference old values.

#### The Solution
```javascript
// Solution 1: Capture value immediately
const handleClick = () => {
  const currentCount = count; // Capture now
  setTimeout(() => {
    console.log(currentCount);
  }, 1000);
};

// Solution 2: Use refs for latest value
const countRef = useRef(count);
countRef.current = count; // Keep ref updated

const handleClick = () => {
  setTimeout(() => {
    console.log(countRef.current); // Always latest
  }, 1000);
};
```

#### Real Example from ReelRecs
In ComparisonModal, the setTimeout callback was using stale `secondMovie` prop:
```javascript
// PROBLEM: secondMovie might change during the 700ms delay
setTimeout(() => {
  onSelectSecond(secondMovie); // Stale!
}, 700);

// SOLUTION: Capture it immediately
const movieToSelect = secondMovie;
setTimeout(() => {
  onSelectSecond(movieToSelect); // Captured value
}, 700);
```

---

### 4. State Updates Not Reflecting Immediately

#### The Problem
```javascript
setState(newValue);
console.log(state); // Still shows OLD value!
```

#### Why It Happens
React state updates are asynchronous and batched for performance.

#### The Solution
```javascript
// Use useEffect to react to state changes
useEffect(() => {
  console.log('State updated:', state);
}, [state]);

// Or use the callback form
setState(prevState => {
  const newState = prevState + 1;
  console.log('New state will be:', newState);
  return newState;
});
```

---

### 5. Console.log Lost During Crashes

#### The Problem
App crashes → Console output disappears → Can't debug the error

#### Why It Happens
React Native's console output is buffered. When the app crashes, the buffer is lost.

#### The Solution
Create a file-based logger (like we did with FileLogger):
```javascript
import RNFS from 'react-native-fs';

class FileLogger {
  log(message, data) {
    const log = `${new Date().toISOString()} - ${message}: ${JSON.stringify(data)}\n`;
    RNFS.appendFile(this.logPath, log);
  }
}
```

---

### 6. Modal Re-rendering Issues

#### The Problem
Modal shows stale data even though props have changed.

#### Common Causes
1. Modal not unmounting between renders
2. Internal state not updating with props
3. Memoization preventing re-renders

#### The Solution
```javascript
// Force remount with key
<Modal key={uniqueKey} {...props} />

// Or reset internal state on prop change
useEffect(() => {
  setInternalState(propValue);
}, [propValue]);
```

---

### 7. Animation Callbacks and State

#### The Problem
```javascript
Animated.timing(animation, {
  toValue: 1,
  duration: 500,
}).start(() => {
  doSomething(state); // State might be stale!
});
```

#### The Solution
```javascript
// Use refs for animations
const stateRef = useRef(state);
stateRef.current = state;

animation.start(() => {
  doSomething(stateRef.current);
});
```

---

### 8. NaN Display Issues

#### The Problem
```javascript
const percentage = (value / total) * 100;
return <Text>{percentage}%</Text>; // Might show "NaN%"
```

#### Why It Happens
Division by zero, undefined values, or non-numeric strings.

#### The Solution
```javascript
const safePercentage = (value, total) => {
  const calc = (value / total) * 100;
  return isNaN(calc) ? 0 : calc;
};

// Or with fallback
const percentage = Number(value) / Number(total) * 100 || 0;
```

---

### 9. Metro Bundler Cache Issues

#### The Problem
Changes not reflecting, old code running, mysterious errors.

#### The Solution
```bash
# Nuclear option - clear everything
watchman watch-del-all
rm -rf node_modules
rm -rf ios/Pods
npm install
cd ios && pod install
cd .. && npx react-native start --reset-cache
```

---

### 10. iOS Simulator Storage

#### The Problem
Can't find app data, logs, or stored files.

#### The Location
```
/Users/[username]/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/
```

#### Finding the Right Folder
```bash
# Find newest app folder (usually the current one)
ls -lat /Users/willi/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/
```

---

## 🎭 React Native vs React Web Differences

### Text Handling
- **Web**: Text anywhere in JSX
- **Native**: Must use `<Text>` component

### Styling
- **Web**: CSS files, classes
- **Native**: StyleSheet objects, inline styles

### Navigation
- **Web**: React Router, URLs
- **Native**: React Navigation, stacks

### Storage
- **Web**: localStorage, sessionStorage
- **Native**: AsyncStorage, file system

### Debugging
- **Web**: Browser DevTools
- **Native**: React Native Debugger, Flipper, custom logging

---

## 💀 Death by a Thousand Cuts

### Small Issues That Compound

1. **Missing Semicolons**: Usually fine, but can cause weird errors
2. **Trailing Commas**: Fine in objects, can break in some places
3. **Extra Spaces**: Can cause text rendering errors
4. **Inconsistent Quotes**: Mix of single/double can cause issues
5. **Unused Imports**: Can prevent tree shaking

### The Lesson
Small issues that seem harmless can combine to create mysterious bugs. Keep code clean and consistent.

---

## 🔥 Platform-Specific Issues

### iOS Specific
- Requires Xcode and CocoaPods
- Certificates and provisioning profiles
- Simulator vs device differences
- Native module linking

### Android Specific
- Gradle build issues
- Different text rendering
- Hardware back button
- Permissions handling

---

## 📱 Performance Pitfalls

### 1. Re-renders
```javascript
// BAD: Creates new object every render
<Component style={{flex: 1}} />

// GOOD: Static style
const styles = StyleSheet.create({
  container: {flex: 1}
});
<Component style={styles.container} />
```

### 2. Large Lists
```javascript
// BAD: ScrollView with 1000 items
<ScrollView>
  {items.map(item => <Item key={item.id} />)}
</ScrollView>

// GOOD: FlatList with virtualization
<FlatList
  data={items}
  renderItem={({item}) => <Item />}
  keyExtractor={item => item.id}
/>
```

---

## 🚀 Lessons Learned

### Always
1. Use FileLogger for debugging crashes
2. Wrap all text in `<Text>` components
3. Avoid JSX comments inside components
4. Clear Metro cache when things get weird
5. Test on actual device, not just simulator
6. Handle edge cases (null, undefined, empty arrays)
7. Use TypeScript for better error catching

### Never
1. Trust console.log in crashes
2. Assume state updates are synchronous
3. Use bare text in JSX
4. Ignore warning messages
5. Skip error boundaries
6. Trust that "it works on my machine"

---

## 🆘 Emergency Procedures

### When Nothing Makes Sense
1. Clear all caches
2. Delete node_modules and reinstall
3. Reset simulator
4. Check for JSX comments
5. Add FileLogger everywhere
6. Verify text is wrapped
7. Check for stale closures
8. Restart your computer (seriously)

---

## 📚 Additional Resources

- React Native docs: Often outdated but still useful
- Stack Overflow: Your best friend
- GitHub issues: Check if others have same problem
- Discord/Slack communities: Real-time help

---

## Final Wisdom

> "The error message is usually wrong. The problem is usually simpler than you think. The solution is usually more complex than you'd like."

When debugging React Native, remember:
1. The error message might be misleading
2. Start with the simplest possible cause
3. Binary search your debugging (comment out half the code)
4. When you find the issue, document it
5. There's no shame in restarting everything

---

This guide represents hours of painful debugging condensed into preventable lessons. May future developers suffer less.