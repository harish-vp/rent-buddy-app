cd /Users/harish.pv/flipkart_git/rent-budy-app/
rm -rf node_modules
rm -f yarn.lock package-lock.json # Delete the lock file you use
npm cache clean --force # or yarn cache clean
rm -rf $TMPDIR/react-native-packager-cache-*
rm -rf $TMPDIR/metro-*
watchman watch-del-all # (macOS/Linux only, if you have watchman installed)
cd android
./gradlew clean # On Windows, use `gradlew.bat clean`
rm -rf .gradle # Deletes Gradle's own cache for the project
rm -rf build # Deletes the main build output folder
rm -rf app/build # Deletes the app module's build output folder
rm -rf app/.cxx # Deletes native build artifacts (if any C++ used)
rm -rf app/src/main/assets/react-bundle # If you manually bundled before
# Crucially, delete the generated autolinking folder if it exists
rm -rf build/generated/autolinking # This is the specific folder where autolinking.json is expected
cd ..
cd ios
rm -rf Pods
rm -f Podfile.lock
rm -rf build # Xcode build folder
# If using Xcode, clear Derived Data manually:
# Open Xcode -> Preferences -> Locations -> Derived Data -> Click the arrow to open in Finder -> Delete the folder for your project.
cd ..
npm install
