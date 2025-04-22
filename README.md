# Ladeklubben Meter App

Free and open-source app to control your EV charger

# Quickstart Guide

## Step 1 - Prerequisites

#### Live Reloading

1. Create a .env file with the IP of your development computer. Also add a Jawg Access Token

```
IP=192.168.XXX.XXX
VITE_JAWG_ACCESS_TOKEN=<INSERT_HERE>
```

2. Open port 5173 on your development computer.
3. Run `npm run cap-dev-android` or `npm run cap-dev-ios`

### Nix Setup

Very easy to get working, without having to fiddle with Android Studio dependencies.

1. Install [Nix package manager](https://nixos.org/download/). Not NixOS (unless you want to switch OS)
1. _Optional -_ Install [direnv](https://direnv.net/docs/installation.html#from-system-packages) for automatic shell activation
1. Clone repository and open it
1. If using direnv, enter `direnv allow`. This is a one-time thing.

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
