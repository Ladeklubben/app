with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    jdk21
    android-tools
    android-studio
  ];

  shellHook = ''
    export CAPACITOR_ANDROID_STUDIO_PATH=/run/current-system/sw/bin/android-studio
    export ANDROID_SDK_ROOT=/home/aw/Android/Sdk
    export JAVA_HOME=${pkgs.jdk21}/lib/openjdk
    export PATH=$JAVA_HOME/bin:$PATH
  '';
}