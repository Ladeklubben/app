with import <nixpkgs> {};

let
  androidComposition = androidenv.composeAndroidPackages {
    includeNDK = true;
    platformVersions = ["34"]; # Update this to include the SDK version you want to use. If Android automatically tries to install a version and fails, add it here instead.
  };
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    pkg-config
    gobject-introspection
    rustup
    cargo-tauri
    nodejs_20
  ];

  buildInputs = with pkgs;[
    at-spi2-atk
    atkmm
    cairo
    gdk-pixbuf
    glib
    gtk3
    harfbuzz
    librsvg
    libsoup_3
    pango
    webkitgtk_4_1
    openssl
    openjdk
    androidComposition.androidsdk
  ];

  shellHook = ''
    export ANDROID_HOME=${androidComposition.androidsdk}/libexec/android-sdk
    export NDK_HOME=$ANDROID_HOME/ndk-bundle
    '';
}
