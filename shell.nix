with import <nixpkgs> {};

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
  ];
}