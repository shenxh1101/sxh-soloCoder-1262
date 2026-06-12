const Header = () => {
  const asciiArt = `
 █████╗ ███████╗ ██████╗██╗██╗    ██████╗ ███████╗███╗   ██╗
██╔══██╗██╔════╝██╔════╝██║██║    ██╔══██╗██╔════╝████╗  ██║
███████║███████╗██║     ██║██║    ██████╔╝█████╗  ██╔██╗ ██║
██╔══██║╚════██║██║     ██║██║    ██╔══██╗██╔══╝  ██║╚██╗██║
██║  ██║███████║╚██████╗██║██║    ██║  ██║███████╗██║ ╚████║
╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
`;

  return (
    <header className="text-center py-8 md:py-12 relative">
      <div className="hidden md:block overflow-hidden mb-4">
        <pre className="text-[8px] lg:text-[10px] text-terminal-green/40 font-mono leading-none text-glow-sm whitespace-pre inline-block animate-flicker">
          {asciiArt}
        </pre>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-terminal-green text-glow mb-3 font-display tracking-wider">
        ASCII 字符画生成器
      </h1>
      <p className="text-terminal-green/70 text-sm md:text-base max-w-xl mx-auto">
        将图片转换为复古风格的 ASCII 字符艺术 · 实时预览 · 多种字符集 · 一键分享
      </p>
      <div className="flex items-center justify-center gap-2 mt-4 text-terminal-green/50 text-xs">
        <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
        <span>SYSTEM READY</span>
        <span className="w-2 h-2 rounded-full bg-terminal-green/30" />
        <span>v1.0.0</span>
      </div>
    </header>
  );
};

export default Header;
