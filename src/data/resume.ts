export interface SkillBar {
  name: string;
  level: number;
  label?: string;
}

export interface SkillGroup {
  title: string;
  skills: SkillBar[];
}

export interface Project {
  icon: string;
  title: string;
  type: string;
  desc: string;
  video?: string;
  chips: string[];
}

export interface Experience {
  company: string;
  role: string;
  badges: string[];
  summary?: string;
  list?: string[];
}

export interface Education {
  year: string;
  school: string;
  desc: string;
}

export interface Contact {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export const resume = {
  meta: {
    name: "崔伊超",
    role: "Windows 客户端 / 互动展项开发工程师",
    description:
      "崔伊超，近 10 年开发经验，Windows 客户端 / 互动展项开发工程师。擅长 C/C++、C#，熟悉 Python；熟悉 Windows 客户端开发与 WPF，熟练使用 Unity 与 openFrameworks，熟悉 OpenCV 与网络协议，熟悉 WebSocket、MQTT、Protobuf、Node.js，熟练使用 Git，了解 Electron 桌面开发。曾就职于合肥磐石科技，负责科技馆互动展项与工具软件研发。",
    keywords:
      "崔伊超, 个人简历, C++, C#, Unity, openFrameworks, OpenCV, WPF, Windows 开发, 互动展项",
  },

  nav: [
    { href: "#about", text: "关于" },
    { href: "#skills", text: "技能" },
    { href: "#projects", text: "代表项目" },
    { href: "#independent", text: "个人项目" },
    { href: "#tools", text: "工具与框架" },
    { href: "#experience", text: "经历" },
    { href: "#education", text: "教育" },
  ],

  hero: {
    kicker: "Hi，我是",
    name: "崔伊超",
    role: "Windows 客户端 / 互动展项开发工程师",
    desc: "近 10 年开发经验，长期专注科技馆互动展项与工具软件研发。熟悉 C/C++、C#，熟练使用 Unity3d引擎 与 c++开源框架openFrameworks，熟悉wpf和win32桌面应用开发，擅长软硬件联动控制，具备完整的工具链与内部框架建设能力。",
    tags: [
      "C / C++",
      "C#",
      "Unity",
      "openFrameworks",
      "OpenCV",
      "WPF",
      "Python",
      "Cursor",
      "Processing",
    ],
    stats: [
      { value: "10", label: "年开发经验" },
      { value: "6", label: "标志性互动展项" },
      { value: "10+", label: "工具类软件" },
      { value: "1", label: "内部 Unity 框架" },
    ],
  },

  about: {
    paragraphs: [
      "资深软件工程师，从事开发工作近 10 年，专注于 Windows 平台客户端应用与科技馆互动展项软件研发。上一家公司为合肥磐石科技，主要承接科技馆项目，我负责互动类软件的开发，常常需要控制硬件联动，曾主导「律动光柱」「沉浸式花海」「磁片墙」等标志性展项项目。",
      "除展品项目外，我还负责雷达标定工具、项目授权系统等工具类软件的开发，并长期负责公司内部 Unity 框架的开发与维护，致力于沉淀通用能力、统一开发规范、提升团队交付效率。",
      "日常开发中熟练使用 Cursor、OpenCode CLI、Pi CLI 等 AI 编程工具辅助提效，常用模型包括 DeepSeek、Grok、GPT 与 Gemini，并结合 AI 与 Python 开发了串口 / 网络调试助手、图片处理工具、视频转换工具、投影遮罩工具等实用工具，覆盖调试、图像处理与多媒体制作等场景。",
    ],
    points: [
      "熟悉 C / C++、C#、Python、JavaScript",
      "熟练使用 Cursor、OpenCode CLI、Pi CLI 等 AI 编程工具",
      "常用 AI 模型：DeepSeek、Grok、GPT、Gemini",
      "熟悉 Windows 平台客户端应用开发",
      "熟练使用 Unity 引擎与 openFrameworks",
      "熟悉 OpenCV 常用算法及应用",
      "熟悉 WPF 开发",
      "熟悉 WebSocket 实时通信与 Protobuf 协议",
      "熟悉 MQTT 协议及物联网设备通信",
      "熟悉 Node.js 开发，了解 Electron 桌面应用开发",
      "擅长互动硬件联动控制（网络 / 串口/ 传感器 / 雷达）",
      "熟练使用 Processing 创意编程工具",
      "熟悉现代 C++、C# 新标准",
    ],
  },

  skillGroups: [
    {
      title: "编程语言",
      skills: [
        { name: "C / C++（C++20）", level: 70, label: "熟练" },
        { name: "C#（C# 13）", level: 70, label: "熟练" },
        { name: "Python", level: 70, label: "熟悉" },
        { name: "JavaScript", level: 70, label: "熟悉" },
      ],
    },
    {
      title: "客户端与引擎",
      skills: [
        { name: "Windows 客户端 / WPF", level: 92, label: "熟悉" },
        { name: "Unity 引擎", level: 88, label: "熟练" },
        { name: "openFrameworks（C++）", level: 85, label: "熟练" },
        { name: "Processing（创意编程）", level: 82, label: "熟练" },
        { name: "Electron 桌面开发", level: 60, label: "了解" },
      ],
    },
    {
      title: "视觉与网络",
      skills: [
        { name: "OpenCV 常用算法及使用", level: 78, label: "熟悉" },
        { name: "网络协议（TCP / UDP / HTTP 等）", level: 80, label: "熟悉" },
        { name: "WebSocket 实时通信", level: 76, label: "熟悉" },
        { name: "Protobuf 协议", level: 74, label: "熟悉" },
        { name: "MQTT 协议", level: 72, label: "熟悉" },
      ],
    },
    {
      title: "硬件联动",
      skills: [
        { name: "互动硬件联动控制", level: 85, label: "熟练" },
        { name: "串口 / 传感器 / 雷达", level: 82, label: "熟练" },
      ],
    },
    {
      title: "服务端开发",
      skills: [
        { name: "ASP.NET Core", level: 75, label: "熟悉" },
        { name: "EF Core", level: 70, label: "熟悉" },
        { name: "Node.js", level: 72, label: "熟悉" },
      ],
    },
    {
      title: "AI 工具链",
      skills: [
        { name: "Cursor（AI IDE）", level: 90 },
        { name: "OpenCode CLI / Pi CLI", level: 80 },
        { name: "DeepSeek / Grok / GPT / Gemini", level: 82 },
        { name: "AI 辅助开发与提效", level: 88 },
      ],
    },
  ] as SkillGroup[],

  skillChips: [
    "C++",
    "C#",
    "Python",
    "JS",
    "Node.js",
    "Win32",
    "WPF",
    "Unity3D",
    "SQLite",
    "Git",
    "OpenCV",
  ],

  projects: [
    {
      icon: "🎵",
      title: "律动光柱",
      type: "互动展项 · 硬件联动",
      desc: "通过实时音频分析与节奏检测驱动多组光柱矩阵联动，实现音画同步的视觉律动效果。负责上位机软件与硬件联动控制，保障展项长时间稳定运行。",
      video: "律动光柱.mp4",
      chips: ["C++ / openFrameworks", "音频实时分析", "串口 / DMX 硬件控制", "多线程渲染"],
    },
    {
      icon: "🌸",
      title: "沉浸式花海",
      type: "沉浸式互动空间",
      desc: "大型沉浸式花海互动展项，用户动作实时影响花海粒子的形态与色彩变化。负责 Unity 互动程序开发，接入雷达 / 传感器实现人机交互与多屏画面融合。",
      video: "花海墙面.mp4",
      chips: ["Unity / C#", "粒子系统", "雷达交互", "多通道画面融合"],
    },
    {
      icon: "🧲",
      title: "磁片墙",
      type: "互动装置 · 硬件联动",
      desc: "由大量可翻转磁片组成的互动墙，根据图像内容驱动磁片翻转成像。负责上位机控制软件与硬件联动逻辑，实现流畅的翻转动画与图案显示。",
      video: "磁片墙.mp4",
      chips: ["C# / WPF", "串口通信", "图像处理", "硬件联动控制"],
    },
    {
      icon: "🕐",
      title: "时钟墙",
      type: "互动展项 · 硬件联动",
      desc: "由大量时钟单元组成的互动展项，负责互动程序开发与硬件联动控制。",
      video: "时钟墙.mp4",
      chips: ["互动程序开发", "硬件联动控制"],
    },
    {
      icon: "⛰️",
      title: "等高线",
      type: "互动展项",
      desc: "以等高线地形为主题的互动展项，负责互动程序开发与视觉呈现。",
      video: "等高线.mp4",
      chips: ["互动程序开发", "视觉呈现"],
    },
    {
      icon: "🐍",
      title: "磁液贪食蛇",
      type: "互动展项 · 硬件联动",
      desc: "以磁液驱动的小游戏互动展项，还原经典贪吃蛇玩法，负责程序开发与硬件联动控制。",
      video: "磁液.mp4",
      chips: ["互动程序开发", "硬件联动控制"],
    },
  ] satisfies Project[],

  independent: [
    {
      icon: "♟️",
      title: "在线中国象棋对战平台",
      type: "AI 辅助开发 · 在线对战",
      desc: "设计并开发的一款在线中国象棋对战平台，采用 Node.js + WPF 技术栈，覆盖从服务端到客户端的完整链路。服务端基于 Node.js 实现房间管理、实时对局逻辑与消息转发，并通过 cpolar 内网穿透将服务映射到公网，网外玩家也可随时联网对战；客户端基于 WPF（C#）实现棋盘渲染、走子交互与对局状态实时刷新，支持双人在线对战与走子规则校验，并接入开源 AI 引擎 eleeye 提供人机对战能力。开发过程中配合使用 Cursor 等 AI 工具辅助编码，显著提升开发效率。",
      video: "中国象棋演示.mp4",
      chips: [
        "Node.js",
        "WPF / C#",
        "WebSocket",
        "cpolar 内网穿透",
        "eleeye AI 引擎",
        "实时对战",
        "棋规校验",
        "AI 辅助开发",
      ],
    },
    {
      icon: "🖥️",
      title: "CommuSystem — 局域网设备监控与远程运维系统",
      type: "全栈自研 · Vue 3 + Node.js + C# / .NET 8",
      desc: "面向内网小规模场景自研的设备监控与远程运维平台，独立完成服务端、管理端与桌面 Agent 的完整链路。管理端采用 Vue 3（Vite + TypeScript + Pinia + Element Plus + ECharts + xterm.js），服务端基于 Node.js（Express + ws + better-sqlite3）构建统一中枢，桌面 Agent 为 C# / .NET 8 WPF 托盘应用。通过 WebSocket 双通道（/ws/agent、/ws/admin）实现设备在线看板、CPU/内存指标历史、一次性命令、基于 ConPTY 的交互式终端、只读实时屏幕流与经服务端中转的文件收发（sha256 校验 + 断点续传），并提供登录、命令、终端、文件等全量审计。安全方面实现管理员 JWT、设备注册密钥与设备令牌、本地与服务端双重能力开关、限流与可选 TLS。协议按语言无关设计，采用 JSON 控制帧 + 二进制数据帧，并在 Node.js 与 C# 之间保持跨语言契约一致。",
      video: "局域网管理系统.mp4",
      chips: [
        "Node.js",
        "WebSocket",
        "Vue 3",
        "TypeScript",
        "C# / .NET 8",
        "WPF",
        "SQLite",
        "ConPTY",
        "xterm.js",
        "ECharts",
        "二进制协议",
        "JWT / 审计",
      ],
    },
  ] satisfies Project[],

  tools: [
    {
      icon: "📡",
      title: "雷达标定工具",
      type: "现场调试工具",
      desc: "面向互动展项现场交付的雷达标定软件，简化设备坐标系标定流程，提升项目实施与调试效率。",
      chips: ["C++ / C#", "坐标变换", "可视化调试"],
    },
    {
      icon: "🔐",
      title: "项目授权系统",
      type: "软件授权管理",
      desc: "公司展项软件的统一授权与加密管理方案，支持按项目、时间、设备等维度控制软件使用范围与期限。",
      chips: ["C#", "加密与校验", "网络验证"],
    },
    {
      icon: "🧩",
      title: "内部 Unity 框架",
      type: "开发与维护",
      desc: "面向互动展项沉淀的 Unity 通用框架，统一场景管理、硬件通信、通用组件与调试能力，长期开发与维护，支撑多项目快速交付。",
      chips: ["Unity / C#", "框架设计", "通用组件"],
    },
    {
      icon: "🈯",
      title: "翻译助手",
      type: "效率工具",
      desc: "轻量的原生 Win32 剪贴板翻译工具，复制即译，接入有道、微软、百度、谷歌翻译，便于日常阅读与开发时快速获取译文。",
      chips: ["Win32", "C++", "剪贴板", "有道", "微软", "百度", "谷歌翻译"],
    },
    {
      icon: "🤖",
      title: "AI Git 自动管理工具",
      type: "命令行工具",
      desc: "AI 自动生成 Conventional Commits 提交信息的命令行工具，支持 DeepSeek、OpenAI、Anthropic、Ollama 四个服务商。",
      chips: ["CLI", "Conventional Commits", "DeepSeek", "OpenAI", "Anthropic", "Ollama"],
    },
    {
      icon: "📌",
      title: "截图助手",
      type: "桌面小工具",
      desc: "基于 Win32 / C++ 的 Windows 桌面小工具，截取屏幕指定区域，并以浮动图片窗口方式固定显示。",
      chips: ["Win32 / C++", "截图", "浮动窗口"],
    },
    {
      icon: "⌨️",
      title: "五笔拼音混合输入法",
      type: "输入法",
      desc: "个人定制版 Windows 五笔拼音输入法，基于 TSF（Text Services Framework）开发，脱胎于微软 SampleIME，支持手写输入。",
      chips: ["TSF", "C++", "五笔 / 拼音", "手写", "SampleIME"],
    },
    {
      icon: "🛠️",
      title: "串口 / 网络调试助手",
      type: "调试工具",
      desc: "集成串口与网络通信的一体化调试工具，串口支持多波特率与常用数据格式，网络支持 TCP / UDP / WebSocket 等常用协议，辅助硬件联调、通信联调与问题排查。",
      chips: ["Python", "串口通信", "TCP / UDP", "WebSocket"],
    },
    {
      icon: "🖼️",
      title: "图片处理工具",
      type: "图像工具",
      desc: "批量图片处理工具，支持格式转换、缩放、压缩等常用操作，提升素材处理效率。",
      chips: ["Python", "图像处理"],
    },
    {
      icon: "🎞️",
      title: "视频转换工具",
      type: "多媒体工具",
      desc: "基于FFmpeg的批量视频转换工具，支持格式转换、序列帧与视频互转等常用操作，常用于投影与展项素材制作。",
      chips: ["Python", "FFmpeg", "批量转换"],
    },
    {
      icon: "🎭",
      title: "投影遮罩工具",
      type: "视觉工具",
      desc: "投影类展项的遮罩（Mask）制作工具，辅助画面遮蔽与融合调试。",
      chips: ["Python", "投影映射"],
    },
  ] satisfies Project[],

  experiences: [
    {
      company: "合肥磐石科技",
      role: "互动软件 / 客户端开发工程师",
      badges: ["🏆 2018 年度优秀员工", "上一家公司(2018-2026)"],
      summary:
        "主要承接科技馆项目，负责互动类软件研发，经常需要控制硬件联动；同时负责工具类软件与内部框架建设。所有项目均独立开发完成。",
      list: [
        "负责科技馆互动展项软件的需求分析、方案设计、编码实现、软硬件联调与现场交付",
        "主导「律动光柱」「沉浸式花海」「磁片墙」等标志性展项的核心开发",
        "负责雷达标定工具、项目授权系统等工具类软件研发",
        "负责公司内部 Unity 框架的开发与维护，推动团队开发效率提升",
        "与硬件、美术、现场工程团队紧密协作，解决软硬件联动中的实际问题",
      ],
    },
    {
      company: "合肥探奥科普有限公司",
      role: "软件开发及调试",
      badges: ["2016.3 — 2018.3"],
      summary: "负责科普展项软件的开发与调试，参与展项现场安装调试与交付。",
    },
    {
      company: "合肥中移股份有限公司",
      role: "基站设备维护",
      badges: ["2011.9 — 2015.5"],
      summary: "负责通信基站设备的日常维护与故障处理，保障设备稳定运行。",
    },
  ] satisfies Experience[],

  education: {
    list: [
      { year: "2011", school: "中国科学技术大学", desc: "函授本科 · 2011 年毕业" },
      { year: "2008", school: "电子信息职业技术学院", desc: "专科 · 2008 年毕业" },
    ] satisfies Education[],
    extraLabel: "语言能力",
    extraChips: ["大学英语四级（CET-4）"],
  },

  contacts: [
    { icon: "✉️", label: "邮箱", value: "240036082@qq.com", href: "mailto:240036082@qq.com" },
    { icon: "📱", label: "电话 / 微信", value: "189-1964-7885" },
    { icon: "🐙", label: "GitHub", value: "github.com/hk6686595", href: "https://github.com/hk6686595" },
    { icon: "📍", label: "所在城市", value: "合肥" },
  ] satisfies Contact[],

  footerNote: "C / C++ · C# · Unity · openFrameworks · OpenCV · WPF",

  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "崔伊超",
    jobTitle: "Windows 客户端 / 互动展项开发工程师",
    knowsAbout: [
      "C/C++",
      "C#",
      "Python",
      "Unity",
      "openFrameworks",
      "OpenCV",
      "WPF",
      "网络协议",
      "WebSocket",
      "MQTT",
      "Protobuf",
      "Git",
      "硬件联动",
    ],
    alumniOf: ["中国科学技术大学", "电子信息职业技术学院"],
    worksFor: "合肥磐石科技",
  },
};

export type Resume = typeof resume;
