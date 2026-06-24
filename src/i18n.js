import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const userLang = typeof navigator !== "undefined"
  ? (navigator.language || navigator.userLanguage || "en").split("-")[0]
  : "en";
const defaultLang = ["en", "es"].includes(userLang) ? userLang : "en";

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        work: "Work",
        recruiterHub: "Recruiter Hub",
        testimonials: "Testimonials",
        contact: "Contact",
        cv: "CV",
        cvEs: "CV Spanish",
        cvEn: "CV English"
      },
      about: {
        title: "About Me",
        name: "Hi, I'm Julian Correa",
        bio: "For the past four and a half years, I have honed my frontend development skills, building dynamic web and mobile application solutions.",
        timezoneTitle: "Time Zone",
        timezoneSub: "I'm based in Mars, and open to remote work worldwide",
        collaborationTitle: "Do you want to start a project together?",
        techstackTitle: "Tech Stack",
        techstackSub: "I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications"
      },
      contact: {
        title: "Let's Talk",
        subtitle: "Whether you're looking to build a new website, improve your existing platform, or bring a unique project to life, I'm here to help.",
        nameLabel: "Full Name",
        emailLabel: "Email",
        messageLabel: "Message",
        sendBtn: "Send",
        sendingBtn: "Sending...",
        successMsg: "Your message has been sent!",
        errorMsg: "Something went wrong! Check console."
      },
      footer: {
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        rights: "© 2025 Julian Correa. All rights reserved."
      },
      hero: {
        wordSecure: "Secure",
        wordModern: "Modern",
        wordScalable: "Scalable",
        greeting: "Hi, I'm Julian",
        titleCraftingPart1: "A Developer",
        titleCraftingPart2: "Dedicated to Crafting",
        titleWebSolutions: "Web Solutions",
        titleBuilding: "Building",
        titleWebApps: "Web Applications"
      },
      copyEmail: {
        copied: "Email has Copied",
        copy: "Copy Email Address"
      },
      cyberShield: {
        title: "Cyber Shield",
        status: "SECURE",
        scanBlocked: "Port Scan Blocked",
        loginDenied: "Suspicious Login Denied",
        payloadSanitized: "Payload Sanitized",
        levelHigh: "HIGH",
        levelMedium: "MEDIUM",
        levelLow: "LOW"
      },
      projects: {
        title: "My Selected Projects",
        readMore: "Read More",
        viewProject: "View Project",
        ecommerce: {
          title: "E-commerce Platform",
          description: "Facilitates purchases from international websites like Amazon and eBay, allowing customers to shop from these sites and have products delivered domestically.",
          subDescription0: "Built a scalable application with ASP.NET Core MVC."
        },
        auth: {
          title: "Authentication & Authorization System",
          description: "A secure authentication and authorization system.",
          subDescription0: "Integrated Auth0 for authentication."
        },
        blazor: {
          title: "Blazor Web App",
          description: "A modern, interactive web application.",
          subDescription0: "Developed a fully interactive SPA."
        },
        cpp: {
          title: "C++ Game Engine",
          description: "A lightweight C++ game engine.",
          subDescription0: "Built a powerful rendering engine."
        },
        wordpress: {
          title: "WordPress Custom Theme",
          description: "A fully customizable WordPress theme.",
          subDescription0: "Developed a responsive WordPress theme."
        },
        learning: {
          title: "Online Learning Platform",
          description: "A web application for video courses and quizzes.",
          subDescription0: "Built using Blazor WebAssembly."
        },
        flutter: {
          title: "Flutter Mobile App",
          description: "Cross-platform app focused on fast UX and clean architecture.",
          subDescription0: "Built with Flutter and Dart using reusable widgets and state-driven UI flows."
        },
        react: {
          title: "React + Vite Web Platform",
          description: "Modern web platform optimized for performance and scalability.",
          subDescription0: "Implemented modular components, responsive layouts, and fast builds with Vite."
        },
        saas: {
          title: "SaaS-based POS System",
          description: "Backend-oriented system for secure data management workflows.",
          subDescription0: "Developed PHP services and relational data structures for business operations."
        }
      },
      experiences: {
        innventa: {
          title: "Front End Developer (Web & Mobile App)",
          job: "Innventa software y technology",
          content0: "Built front-end interfaces for web and mobile applications with a strong focus on scalable architecture, maintainability, and user experience.",
          content1: "Implemented reusable component systems and responsive layouts across multiple devices and screen resolutions.",
          content2: "Integrated REST APIs, handled complex state management, and implemented form validation for business-critical workflows.",
          content3: "Applied performance best practices (lazy loading, render optimization, bundle reduction) and accessibility standards.",
          content4: "Collaborated closely with design, backend, and QA teams under agile methodologies to deliver high-impact releases continuously."
        },
        bety: {
          title: "Senior Front End Developer (Web & Mobile App)",
          job: "Bety (Professional Services)",
          content0: "Led the web and mobile front-end domain, defining code standards, project structure, and consistent UI guidelines.",
          content1: "Designed and evolved SaaS product interfaces, improving usability, conversion, and navigation flow.",
          content2: "Delivered advanced performance optimizations for mobile and desktop (3D rendering, interactions, scrolling, and critical asset loading).",
          content3: "Provided technical mentorship to the front-end team in architecture, debugging, code quality, and development best practices.",
          content4: "Coordinated strategically with product, design, and business stakeholders to prioritize features, reduce technical debt, and accelerate releases."
        }
      },
      experience: {
        title: "My Work Experience"
      },
      reviews: {
        jack: "Amazing. I love it.",
        jill: "Speechless. This is amazing.",
        john: "I love it.",
        alice: "Highly recommend!",
        bob: "Phenomenal attention to detail.",
        charlie: "Absolutely stunning!",
        dave: "Best decision I've made.",
        eve: "Changed the game for me."
      },
      recruiter: {
        title: "Recruiter Hub",
        subtitle: "Simulate your job vacancy requirements and analyze my fit and profile in real-time.",
        availableBadge: "Available for Interviews",
        configureTitle: "⚙️ Configure Vacancy",
        presetLabel: "1. Select a Role Profile",
        presetFrontend: "Front End Developer (Specialty)",
        presetMobile: "Mobile App Developer (Specialty)",
        presetFullstack: "Full Stack Developer (.NET + React)",
        presetCustom: "Custom Profile (Select skills below)",
        skillsLabel: "2. Required Skills",
        seniorityLabel: "3. Required Seniority",
        workplaceLabel: "4. Work Arrangement",
        onsite: "Onsite",
        remote: "Remote",
        hybrid: "Hybrid",
        scoreTitle: "Compatibility Results",
        feedbackExcellent: "Excellent Match! Julián has the technologies and work conditions ideal for your vacancy. Ready to add value from day one.",
        feedbackStrong: "Strong Match. Meets most of your requirements and has great flexibility to adapt to the role quickly.",
        feedbackModerate: "Moderate Match. Although his core stack varies, his solid foundation in Javascript, C#, and mobile development allows for a successful transition.",
        chartTitle: "📊 Skills Coverage Chart",
        julianCapacity: "Julián Correa (Capacity)",
        yourRequirement: "Your Job Requirement",
        readyToContact: "Ready to contact or review credentials?",
        downloadCvEn: "📥 CV English",
        downloadCvEs: "📥 CV Spanish",
        generatedMessageLabel: "Dynamically generated message:",
        copyMessageBtn: "📋 Copy message for Julián",
        copiedBtn: "✓ Message Copied",
        fastChannels: "Quick channels:",
        radarLabels: {
          frontend: "Frontend (React/Vite)",
          mobile: "Mobile (Flutter/Ionic)",
          backend: "Backend (.NET/PHP)",
          tools: "Tools (Git/CI)",
          softSkills: "Soft Skills"
        },
        defaultContactMsg: "Hi Julián, I visited your portfolio and saw that we have a hiring compatibility of {{score}}% for our developer position ({{mode}}) requiring skills in: {{skills}}. Would you be interested in talking?"
      },
      testimonial: {
        title: "Hear From My Clients",
        formTitle: "Share Your Experience",
        formSubtitle: "Have we worked together or do you have feedback about my work? Leave your review or your company's to appear in the carousel above in real-time.",
        avatarGenerated: "Generated Avatar",
        nameOrCompanyLabel: "Name or Company *",
        namePlaceholder: "e.g., Tesla or Carlos Gómez",
        handleLabel: "Handle / Role",
        handlePlaceholder: "e.g., @ceo or Tech Lead",
        yourCommentLabel: "Your Comment *",
        commentPlaceholder: "Write your testimonial here...",
        anonymous: "@anonymous",
        submitBtn: "Publish Comment",
        sendingBtn: "Sending...",
        successMsg: "Published! It will appear in the carousel above.",
        errorRequired: "Please, fill in the required fields (Name and Comment).",
        errorSave: "Failed to save comment on the server.",
        errorPublish: "Could not publish testimonial at this time. Please try again."
      },
      aiChat: {
        badge: "AI",
        welcome: "Hi, I'm Julian's AI assistant. Ask me about projects, experience, stack, or availability.",
        contactWhatsapp: "Chat on WhatsApp",
        errorConn: "Connection issue with AI backend. Please try again.",
        errorReach: "I cannot reach the AI service right now. Please retry in a moment.",
        placeholder: "Ask about Julian's projects, stack, or experience...",
        send: "Send",
        thinking: "Thinking..."
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        about: "Sobre Mí",
        work: "Experiencia",
        recruiterHub: "Recruiter Hub",
        testimonials: "Testimonios",
        contact: "Contacto",
        cv: "CV",
        cvEs: "CV Español",
        cvEn: "CV Inglés"
      },
      about: {
        title: "Sobre Mí",
        name: "Hola, soy Julian Correa",
        bio: "Durante los últimos cuatro años y medio, he perfeccionado mis habilidades de desarrollo frontend, creando soluciones dinámicas para aplicaciones web y móviles.",
        timezoneTitle: "Zona Horaria",
        timezoneSub: "Vivo en Marte y estoy disponible para trabajo remoto en todo el mundo",
        collaborationTitle: "¿Quieres que empecemos un proyecto juntos?",
        techstackTitle: "Stack Tecnológico",
        techstackSub: "Me especializo en una variedad de lenguajes, frameworks y herramientas que me permiten construir aplicaciones robustas y escalables"
      },
      contact: {
        title: "Hablemos",
        subtitle: "Ya sea que estés buscando construir un nuevo sitio web, mejorar tu plataforma existente o dar vida a un proyecto único, estoy aquí para ayudarte.",
        nameLabel: "Nombre Completo",
        emailLabel: "Correo Electrónico",
        messageLabel: "Mensaje",
        sendBtn: "Enviar",
        sendingBtn: "Enviando...",
        successMsg: "¡Tu mensaje ha sido enviado!",
        errorMsg: "¡Algo salió mal! Revisa la consola."
      },
      footer: {
        terms: "Términos y Condiciones",
        privacy: "Política de Privacidad",
        rights: "© 2025 Julian Correa. Todos los derechos reservados."
      },
      hero: {
        wordSecure: "Seguro",
        wordModern: "Moderno",
        wordScalable: "Escalable",
        greeting: "Hola, soy Julian",
        titleCraftingPart1: "Un Desarrollador",
        titleCraftingPart2: "Dedicado a Crear",
        titleWebSolutions: "Soluciones Web",
        titleBuilding: "Construyendo",
        titleWebApps: "Aplicaciones Web"
      },
      copyEmail: {
        copied: "Correo Copiado",
        copy: "Copiar Correo"
      },
      cyberShield: {
        title: "Escudo Cibernético",
        status: "SEGURO",
        scanBlocked: "Escaneo de Puertos Bloqueado",
        loginDenied: "Acceso Sospechoso Denegado",
        payloadSanitized: "Carga Útil Sanitizada",
        levelHigh: "ALTO",
        levelMedium: "MEDIO",
        levelLow: "BAJO"
      },
      projects: {
        title: "Mis Proyectos Seleccionados",
        readMore: "Leer Más",
        viewProject: "Ver Proyecto",
        ecommerce: {
          title: "Plataforma de E-commerce",
          description: "Facilitates purchases from international websites like Amazon and eBay, allowing customers to shop from these sites and have products delivered domestically.",
          subDescription0: "Built a scalable application with ASP.NET Core MVC."
        },
        auth: {
          title: "Sistema de Autenticación y Autorización",
          description: "A secure authentication and authorization system.",
          subDescription0: "Integrated Auth0 for authentication."
        },
        blazor: {
          title: "Aplicación Web Blazor",
          description: "A modern, interactive web application.",
          subDescription0: "Developed a fully interactive SPA."
        },
        cpp: {
          title: "Motor de Videojuegos C++",
          description: "A lightweight C++ game engine.",
          subDescription0: "Built a powerful rendering engine."
        },
        wordpress: {
          title: "Tema Personalizado de WordPress",
          description: "A fully customizable WordPress theme.",
          subDescription0: "Developed a responsive WordPress theme."
        },
        learning: {
          title: "Plataforma de Aprendizaje en Línea",
          description: "A web application for video courses and quizzes.",
          subDescription0: "Built using Blazor WebAssembly."
        },
        flutter: {
          title: "Aplicación Móvil Flutter",
          description: "Cross-platform app focused on fast UX and clean architecture.",
          subDescription0: "Built with Flutter and Dart using reusable widgets and state-driven UI flows."
        },
        react: {
          title: "Plataforma Web React + Vite",
          description: "Modern web platform optimized for performance and scalability.",
          subDescription0: "Implemented modular components, responsive layouts, and fast builds with Vite."
        },
        saas: {
          title: "Sistema POS basado en SaaS",
          description: "Backend-oriented system for secure data management workflows.",
          subDescription0: "Developed PHP services and relational data structures for business operations."
        }
      },
      experiences: {
        innventa: {
          title: "Front End Developer (Web & Mobile App)",
          job: "Innventa software y technology",
          content0: "Desarrollé interfaces front-end para aplicaciones web y móviles con un fuerte enfoque en arquitectura escalable, mantenibilidad y experiencia de usuario.",
          content1: "Implementé sistemas de componentes reutilizables y diseños responsivos en múltiples dispositivos y resoluciones de pantalla.",
          content2: "Integré APIs REST, manejé el estado de aplicaciones complejas e implementé validaciones de formularios para flujos de trabajo críticos de negocio.",
          content3: "Apliqué mejores prácticas de rendimiento (lazy loading, optimización de renderizado, reducción de bundles) y estándares de accesibilidad.",
          content4: "Colaboré estrechamente con los equipos de diseño, backend y QA bajo metodologías ágiles para entregar lanzamientos de alto impacto continuamente."
        },
        bety: {
          title: "Senior Front End Developer (Web & Mobile App)",
          job: "Bety (Servicios Profesionales)",
          content0: "Lideré el área front-end para web y móvil, definiendo estándares de código, estructura del proyecto y pautas consistentes de UI.",
          content1: "Diseñé y evolucioné interfaces de productos SaaS, mejorando la usabilidad, conversión y el flujo de navegación.",
          content2: "Entregué optimizaciones de rendimiento avanzadas para móvil y escritorio (renderizado 3D, interacciones, scrolling y carga de recursos críticos).",
          content3: "Brindé mentoría técnica al equipo front-end en arquitectura, depuración, calidad de código y mejores prácticas de desarrollo.",
          content4: "Coordiné estratégicamente con los involucrados de producto, diseño y negocio para priorizar funcionalidades, reducir la deuda técnica y acelerar los lanzamientos."
        }
      },
      experience: {
        title: "Mi Experiencia Laboral"
      },
      reviews: {
        jack: "Increíble. Me encanta.",
        jill: "Sin palabras. Esto es increíble.",
        john: "Me encanta.",
        alice: "¡Muy recomendado!",
        bob: "Atención al detalle fenomenal.",
        charlie: "¡Absolutamente impresionante!",
        dave: "La mejor decisión que he tomado.",
        eve: "Cambió el juego para mí."
      },
      recruiter: {
        title: "Recruiter Hub",
        subtitle: "Simula las necesidades de tu vacante y analiza mi compatibilidad y perfil en tiempo real.",
        availableBadge: "Disponible para Entrevistas",
        configureTitle: "⚙️ Configura tu Vacante",
        presetLabel: "1. Selecciona un Perfil de Rol",
        presetFrontend: "Front End Developer (Especialidad)",
        presetMobile: "Mobile App Developer (Especialidad)",
        presetFullstack: "Full Stack Developer (.NET + React)",
        presetCustom: "Perfil Personalizado (Elige habilidades abajo)",
        skillsLabel: "2. Habilidades Requeridas",
        seniorityLabel: "3. Seniority Requerido",
        workplaceLabel: "4. Esquema Laboral",
        onsite: "Presencial",
        remote: "Remoto",
        hybrid: "Híbrido",
        scoreTitle: "Resultado de Compatibilidad",
        feedbackExcellent: "¡Match Excelente! Julián cuenta con las tecnologías y condiciones de trabajo ideales para tu vacante. Está listo para aportar valor desde el día uno.",
        feedbackStrong: "Match Fuerte. Cumple con la mayoría de tus requisitos y tiene gran flexibilidad para adaptarse al rol rápidamente.",
        feedbackModerate: "Match Moderado. Aunque su stack principal varía, su sólida base en Javascript, C# y desarrollo móvil le permite realizar una transición succesiva.",
        chartTitle: "📊 Gráfico de Cobertura de Habilidades",
        julianCapacity: "Julián Correa (Capacidad)",
        yourRequirement: "Tu Requisito de Empleo",
        readyToContact: "¿Listo para contactar o revisar credenciales?",
        downloadCvEn: "📥 CV Inglés",
        downloadCvEs: "📥 CV Español",
        generatedMessageLabel: "Mensaje generado dinámicamente:",
        copyMessageBtn: "📋 Copiar mensaje para Julián",
        copiedBtn: "✓ Mensaje Copiado",
        fastChannels: "Canales rápidos:",
        radarLabels: {
          frontend: "Frontend (React/Vite)",
          mobile: "Mobile (Flutter/Ionic)",
          backend: "Backend (.NET/PHP)",
          tools: "Herramientas (Git/CI)",
          softSkills: "Habilidades Blandas"
        },
        defaultContactMsg: "Hola Julián, visité tu portafolio y vi que tenemos una compatibilidad de contratación del {{score}}% para nuestra posición de desarrollo ({{mode}}) requiriendo habilidades en: {{skills}}. ¿Te interesaría conversar?"
      },
      testimonial: {
        title: "Opinión de mis Clientes",
        formTitle: "Comparte tu Experiencia",
        formSubtitle: "¿Hemos trabajado juntos o tienes algún comentario sobre mi trabajo? Deja tu opinión o el de tu empresa para que aparezca en el carrusel superior en tiempo real.",
        avatarGenerated: "Avatar Generado",
        nameOrCompanyLabel: "Nombre o Empresa *",
        namePlaceholder: "Ej. Tesla o Carlos Gómez",
        handleLabel: "Handle / Cargo",
        handlePlaceholder: "Ej. @ceo o Tech Lead",
        yourCommentLabel: "Tu Comentario *",
        commentPlaceholder: "Escribe tu testimonio aquí...",
        anonymous: "@anonimo",
        submitBtn: "Publicar Comentario",
        sendingBtn: "Enviando...",
        successMsg: "¡Publicado! Aparecerá en el carrusel arriba.",
        errorRequired: "Por favor, llena los campos requeridos (Nombre y Comentario).",
        errorSave: "Error al guardar el comentario en el servidor.",
        errorPublish: "No se pudo publicar el testimonio en este momento. Inténtalo de nuevo."
      },
      aiChat: {
        badge: "IA",
        welcome: "Hola, soy el asistente de IA de Julián. Pregúntame sobre sus proyectos, experiencia, stack o disponibilidad.",
        contactWhatsapp: "Escribirme por WhatsApp",
        errorConn: "Problema de conexión con el backend de IA. Por favor, inténtalo de nuevo.",
        errorReach: "No puedo contactar con el servicio de IA en este momento. Por favor, reintenta en un momento.",
        placeholder: "Pregunta sobre los proyectos, stack o experiencia de Julián...",
        send: "Enviar",
        thinking: "Pensando..."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
