{ pkgs }: {
  deps = [
    pkgs.openssh
        pkgs.nodePackages.typescript-language-server
    pkgs.cowsay
  ];
}