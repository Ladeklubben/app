with import <nixpkgs> {};

let
  androidComposition = androidenv.composeAndroidPackages {
    includeNDK = true;
    platformVersions = ["23"];
  };
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    nodejs_22
  ];

  buildInputs = with pkgs;[
    openssl
    openjdk
    androidComposition.androidsdk
  ];

  shellHook = ''
    export ANDROID_HOME=${androidComposition.androidsdk}/libexec/android-sdk
    export NDK_HOME=$ANDROID_HOME/ndk-bundle
    '';
}
