const base = import.meta.env.BASE_URL;

export const myProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description:
        "Facilitates purchases from international websites like Amazon and eBay, allowing customers to shop from these sites and have products delivered domestically.",
    subDescription: [
      "Built a scalable application with ASP.NET Core MVC...",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/accessories.jpg`,
    tags: [
      { id: 1, name: "C#", path: `${base}assets/logos/csharp.svg` },
      { id: 2, name: ".Net", path: `${base}assets/logos/dotnet.svg` },
      { id: 3, name: "Ef Core", path: `${base}assets/logos/efcore.png` },
      { id: 4, name: "TailwindCSS", path: `${base}assets/logos/tailwindcss.svg` },
    ],
  },
  {
    id: 2,
    title: "Authentication & Authorization System",
    description:
        "A secure authentication and authorization system...",
    subDescription: [
      "Integrated Auth0 for authentication...",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/auth-system.jpg`,
    tags: [
      { id: 1, name: "Auth0", path: `${base}assets/logos/auth0.svg` },
      { id: 2, name: "React", path: `${base}assets/logos/react.svg` },
      { id: 3, name: "SQLite", path: `${base}assets/logos/sqlite.svg` },
      { id: 4, name: "TailwindCSS", path: `${base}assets/logos/tailwindcss.svg` },
    ],
  },
  {
    id: 3,
    title: "Blazor Web App",
    description: "A modern, interactive web application...",
    subDescription: [
      "Developed a fully interactive SPA...",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/blazor-app.jpg`,
    tags: [
      { id: 1, name: "Blazor", path: `${base}assets/logos/blazor.svg` },
      { id: 2, name: ".NET Core", path: `${base}assets/logos/dotnetcore.svg` },
      { id: 3, name: "SQLite", path: `${base}assets/logos/sqlite.svg` },
      { id: 4, name: "TailwindCSS", path: `${base}assets/logos/tailwindcss.svg` },
    ],
  },
  {
    id: 4,
    title: "C++ Game Engine",
    description: "A lightweight C++ game engine...",
    subDescription: [
      "Built a powerful rendering engine...",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/game-engine.jpg`,
    tags: [
      { id: 1, name: "C++", path: `${base}assets/logos/cplusplus.svg` },
      { id: 2, name: "C#", path: `${base}assets/logos/csharp.svg` },
      { id: 3, name: "Git", path: `${base}assets/logos/git.svg` },
      { id: 4, name: "Microsoft", path: `${base}assets/logos/microsoft.svg` },
    ],
  },
  {
    id: 5,
    title: "WordPress Custom Theme",
    description: "A fully customizable WordPress theme...",
    subDescription: [
      "Developed a responsive WordPress theme...",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/wordpress-theme.jpg`,
    tags: [
      { id: 1, name: "WordPress", path: `${base}assets/logos/wordpress.svg` },
      { id: 2, name: "HTML5", path: `${base}assets/logos/html5.svg` },
      { id: 3, name: "CSS3", path: `${base}assets/logos/css3.svg` },
      { id: 4, name: "Vite.js", path: `${base}assets/logos/vitejs.svg` },
    ],
  },
  {
    id: 6,
    title: "Online Learning Platform",
    description: "A web application for video courses and quizzes...",
    subDescription: [
      "Built using Blazor WebAssembly...",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/elearning.jpg`,
    tags: [
      { id: 1, name: "Blazor", path: `${base}assets/logos/blazor.svg` },
      { id: 2, name: "Azure", path: `${base}assets/logos/azure.svg` },
      { id: 3, name: "Stripe", path: `${base}assets/logos/stripe.svg` },
      { id: 4, name: "TailwindCSS", path: `${base}assets/logos/tailwindcss.svg` },
    ],
  },
  {
    id: 7,
    title: "Flutter Mobile App",
    description: "Cross-platform app focused on fast UX and clean architecture.",
    subDescription: [
      "Built with Flutter and Dart using reusable widgets and state-driven UI flows.",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/flutter-1.png`,
    images: [
      `${base}assets/projects/flutter-1.png`,
      `${base}assets/projects/flutter-2.png`,
      `${base}assets/projects/flutter-3.png`,
      `${base}assets/projects/flutter-4.png`,
      `${base}assets/projects/flutter-5.png`,
      `${base}assets/projects/flutter-6.png`,
      `${base}assets/projects/flutter-7.png`,
      `${base}assets/projects/flutter-8.png`,
      `${base}assets/projects/flutter-9.png`,
      `${base}assets/projects/flutter-10.png`,
      `${base}assets/projects/flutter-11.png`,
      `${base}assets/projects/flutter-12.png`,
      `${base}assets/projects/flutter-13.png`,
      `${base}assets/projects/flutter-14.png`,
      `${base}assets/projects/flutter-15.png`,
      `${base}assets/projects/flutter-16.png`,
      `${base}assets/projects/flutter-17.png`,
    ],
    tags: [
      { id: 1, name: "Flutter", path: `${base}assets/logos/flutter.svg` },
      { id: 2, name: "Dart", path: `${base}assets/logos/flutter.svg` },
    ],
  },
  {
    id: 8,
    title: "React + Vite Web Platform",
    description: "Modern web platform optimized for performance and scalability.",
    subDescription: [
      "Implemented modular components, responsive layouts, and fast builds with Vite.",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/react-vite-1.png`,
    images: [
      `${base}assets/projects/react-vite-1.png`,
      `${base}assets/projects/react-vite-2.png`,
      `${base}assets/projects/react-vite-3.png`,
    ],
    tags: [
      { id: 1, name: "React", path: `${base}assets/logos/react.svg` },
      { id: 2, name: "Vite", path: `${base}assets/logos/vitejs.svg` },
    ],
  },
  {
    id: 9,
    title: "SaaS-based POS System",
    description: "Backend-oriented system for secure data management workflows.",
    subDescription: [
      "Developed PHP services and relational data structures for business operations.",
    ],
    href: "",
    logo: "",
    image: `${base}assets/projects/php-dashboard.png`,
    tags: [
      { id: 1, name: "PHP", path: `${base}assets/logos/php.svg` },
      { id: 2, name: "MySQL", path: `${base}assets/logos/sqlite.svg` },
    ],
  },
];

export const mySocials = [
  { name: "WhatsApp", href: "", icon: `${base}assets/socials/whatsApp.svg` },
  { name: "Linkedin", href: "", icon: `${base}assets/socials/linkedIn.svg` },
  { name: "Instagram", href: "", icon: `${base}assets/socials/instagram.svg` },
];

export const experiences = [
  {
    title: "Front End Developer (Web & Mobile App)",
    job: "Innventa software y technology",
    date: "2020-2025",
    contents: [
      "Built front-end interfaces for web and mobile applications with a strong focus on scalable architecture, maintainability, and user experience.",
      "Implemented reusable component systems and responsive layouts across multiple devices and screen resolutions.",
      "Integrated REST APIs, handled complex state management, and implemented form validation for business-critical workflows.",
      "Applied performance best practices (lazy loading, render optimization, bundle reduction) and accessibility standards.",
      "Collaborated closely with design, backend, and QA teams under agile methodologies to deliver high-impact releases continuously.",
    ],
  },
  {
    title: "Senior Front End Developer (Web & Mobile App)",
    job: "Bety (Professional Services)",
    date: "2025-2026",
    contents: [
      "Led the web and mobile front-end domain, defining code standards, project structure, and consistent UI guidelines.",
      "Designed and evolved SaaS product interfaces, improving usability, conversion, and navigation flow.",
      "Delivered advanced performance optimizations for mobile and desktop (3D rendering, interactions, scrolling, and critical asset loading).",
      "Provided technical mentorship to the front-end team in architecture, debugging, code quality, and development best practices.",
      "Coordinated strategically with product, design, and business stakeholders to prioritize features, reduce technical debt, and accelerate releases.",
    ],
  },
];

export const reviews = [
  {
    name: "Jack", username: "@jack", body: "Amazing. I love it.", img: "https://robohash.org/jack",
  },
  {
    name: "Jill", username: "@jill", body: "Speechless. This is amazing.", img: "https://robohash.org/jill",
  },
  {
    name: "John", username: "@john", body: "I love it.", img: "https://robohash.org/john",
  },
  {
    name: "Alice", username: "@alice", body: "Highly recommend!", img: "https://robohash.org/alice",
  },
  {
    name: "Bob", username: "@bob", body: "Phenomenal attention to detail.", img: "https://robohash.org/bob",
  },
  {
    name: "Charlie", username: "@charlie", body: "Absolutely stunning!", img: "https://robohash.org/charlie",
  },
  {
    name: "Dave", username: "@dave", body: "Best decision I've made.", img: "https://robohash.org/dave",
  },
  {
    name: "Eve", username: "@eve", body: "Changed the game for me.", img: "https://robohash.org/eve",
  },
];
