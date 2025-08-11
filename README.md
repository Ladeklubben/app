# Ladeklubben Meter App

Free and open-source app to control your EV charger

# Quickstart Guide

## Step 1 - Prerequisites

### Basic Webserver Setup

1. Create a .env file with the IP of your development computer. Also add a Jawg Access Token

```
IP=192.168.XXX.XXX
VITE_JAWG_ACCESS_TOKEN=<INSERT_HERE>
MODE=dev
```
1. Open port 5173 on your development computer.
1. Run `npm run dev` and open the link in the terminal

### iOS App Setup
1. Install XCode and accept the terms
1. Log into Ladeklubben Developer account to allow automatic signing (necessary for running on physical iPhone)
1. Install ruby using `brew install ruby`
1. Install cocoapods `sudo gem install cocoapods`
1. Run `cd ios/App && pod install`
1. Run `npm run cap-dev-ios` to build and setup the live reloading server
1. In a new terminal, run `npx cap run ios` to install the app

### Android Setup
1. Install Android Studio and setup simulators or physical devices
1. Run `npx cap open android` to open project in Android Studio
1. Run the application from Android Studio
1. Run `npm run cap-dev-android` to setup the live reloading server
1. As long as you are making frontend changes (`src/` directory), then you don't need to reinstall the application using Android Studio.

# Adding Icons

- We are using [unplugin-icons](https://github.com/unplugin/unplugin-icons) to manage icons.
- Find and click on an icon you like [here](https://icones.js.org/collection/mdi)
- The website says "How to use the icon?" and it looks like this `category:icon-name`. Fx `mdi:account-box-outline`
- Import the icon as follows: `import IconName from '~icons/category/icon-name'`. Fx `import IconAccountBoxOutline from '~icons/mdi/account-box-outline'`
- We have mainly been using the category `mdi`. If you want to use a different category the plugin will automatically download the icon package, so you just need to import it as usual.

# Troubleshooting

- If your device doesn't come up when you run `adb devices`, try to restart the adb server with `adb kill-server && adb devices`
- If it complains about App signing, then open the project in Xcode and login with your developer account.
- `error: exportArchive: exportOptionsPlist error for key "method": expected one of {app-store, ad-hoc, enterprise, development, validation}, but found debugging` can be solved by modifying the `ExportOptions.plist` file, writing development instead of debugging.
