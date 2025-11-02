# Android APK Build Instructions

## Current Issue
`react-native-reanimated@3.10.1` is not compatible with `react-native@0.81.5`. The library has compilation errors due to API changes in React Native.

## Recommended Solutions

### Option 1: Use GitHub Actions (Easiest - Linux build)
1. Push your code to GitHub
2. Go to Actions tab in your repository
3. Run the "Build Android APK with Gradle" workflow
4. Download the APK from the workflow artifacts

The Linux environment in GitHub Actions handles CMake/prefab better than Windows.

### Option 2: Use EAS Cloud Build
```bash
npm run build:apk
```
EAS handles native module compatibility automatically.

### Option 3: Update react-native-reanimated (if compatible version exists)
Check if there's a newer version that supports RN 0.81.5:
```bash
npm install react-native-reanimated@latest
npx expo prebuild --platform android --clean
```

### Option 4: Use React Native 0.76 or earlier
React Native 0.81.5 is very new. Consider using a more stable version:
```bash
npx expo install react-native@0.76.0
npx expo prebuild --platform android --clean
```

## What's Been Fixed
- ✅ Updated minSdkVersion to 24 (required by React Native 0.81.5)
- ✅ Updated compileSdkVersion to 35 (required by dependencies)
- ✅ Configured Android SDK and Java
- ✅ Updated GitHub Actions workflow
- ✅ Added build scripts to package.json

## Build Commands
- EAS Build: `npm run build:apk`
- Local Build (requires Linux/WSL): `cd android && ./gradlew assembleRelease`
