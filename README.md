# Ladeklubben Meter App
Free and open-source app to control your EV charger

# Quickstart Guide
## Step 1 - Prerequisites

### Nix Setup
Very easy to get working, without having to fiddle with Android Studio dependencies.

1. Install [Nix package manager](https://nixos.org/download/). Not NixOS (unless you want to switch OS)
1. *Optional -* Install [direnv](https://direnv.net/docs/installation.html#from-system-packages) for automatic shell activation
1. Clone repository and open it
1. If using direnv, enter `direnv allow`. This is a one-time thing.

### Manual Setup
1. Follow the Tauri [guide](https://tauri.app/start/prerequisites/)
1. Remember to use Node v20.18.1
1. Install Android Studio and get it set up so you can see your device when plugged in to your computer (Device Manager)

## Step 2 - Starting Tauri
1. Navigate into the repository
1. Install node modules using: `npm install`
1. Start desktop version of application: `npm run tauri dev`

## Step 3 - Start Tauri on Android Device
It is very important you have run Step 2 first, or else Tauri returns an error. If this happens to you, clean the project using `rm -rf src-tauri/gen/ src-tauri/target/ node_modules`. Then complete Step 2 and return here once done.
1. Run `adb devices`, and make sure your Android device is visible
1. Run `npm run tauri android init` and make sure no errors are shown
1. Run `npm run tauri android dev`

Hot Module Reloading does not seem to work on the USB android device, so for developing it is best to use the desktop application from Step 2, and then once in a while check how it looks on Android.

## Step 4 - Start Tauri on iPhone
1. Update to latest Ruby version
```
brew install rbenv ruby-build

# Add rbenv to bash so that it loads every time you open a terminal
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.zshrc
source ~/.zshrc

# Install a newer version and set it to global
rbenv install 3.4.1
rbenv global 3.4.1
```
1. Run `npm run tauri ios init`, it will probably fail
1. Install cocoapods with `sudo gem install cocoapods`. This is why we need to upgrade Ruby
1. Run `npm run tauri ios init` again, it should not fail.

# Adding Icons
- Find and click on an icon you like [here](https://icones.js.org/collection/mdi)
- The website says "How to use the icon?" and it looks like this `category:icon-name`. Fx `mdi:account-box-outline`
- Import the icon as follows: `import IconName from '~icons/category/icon-name'`. Fx `import IconAccountBoxOutline from '~icons/mdi/account-box-outline'`
- We have mainly been using the category `mdi`. If you want to use a different category the plugin will automatically download the icon package, so you just need to import it as usual.

# Troubleshooting
- If your device doesn't come up when you run `adb devices`, try to restart the adb server with `adb kill-server && adb devices`
- If you get the error `xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance` when you try to run `npm run tauri ios dev` then you need to run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` to use the full Xcode.app.
- If it complains about App signing, then open the project in Xcode and login with your developer account.
- `error: exportArchive: exportOptionsPlist error for key "method": expected one of {app-store, ad-hoc, enterprise, development, validation}, but found debugging` can be solved by modifying the `ExportOptions.plist` file, writing development instead of debugging.