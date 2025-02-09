# Ladeklubben Meter App
Free and open-source app to control your EV charger

# Quickstart Guide
## Step 1 - Prerequisites

### Nix Setup
Very easy to get working, without having to fiddle with Android Studio dependencies.

1. Install Nix: `sh <(curl -L https://nixos.org/nix/install) --daemon`
1. *Optional -* Install [direnv](https://direnv.net/docs/installation.html#from-system-packages) for automatic shell activation
1. Clone repository and open it
1. If using direnv, enter `direnv allow`. This is a one-time thing.

### Manual Setup
1. Follow the Tauri [guide](https://tauri.app/start/prerequisites/)
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

# Troubleshooting
- If your device doesn't come up when you run `adb devices`, try to restart the adb server with `adb kill-server && adb devices`