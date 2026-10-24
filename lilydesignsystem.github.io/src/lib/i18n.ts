// UI chrome strings for the /<code>/ tree: nav, footer, picker
// labels, and the localized home page's hero/card copy. Deeper content
// (tutorials, component docs, etc.) is not translated yet — see
// spec/locales-for-global-sharing-with-svelte/index.md's "starts empty"
// rollout note.
//
// Proper nouns ("Lily", "Lily Design System", "GitHub") are left
// unconverted per that spec's "Guard against corruption" rule.

import { DEFAULT_LOCALE } from './locales';

export type UiStrings = {
  skipLink: string;
  brandAriaLabel: string;
  nav: {
    home: string;
    components: string;
    tutorials: string;
    examples: string;
    skills: string;
    help: string;
    about: string;
    github: string;
  };
  footer: {
    license: string;
    trademark: string;
    why: string;
  };
  pickerLabels: {
    theme: string;
    locale: string;
    textSize: string;
    share: string;
    link: string;
    search: string;
    searchInput: string;
    searchSubmit: string;
  };
  home: {
    heroTitle: string;
    heroTagline: string;
    frameworks: string;
    tutorials: { heading: string; description: string };
    components: { heading: string; description: string };
    examples: { heading: string; description: string };
  };
};

const en: UiStrings = {
  skipLink: 'Skip to main content',
  brandAriaLabel: 'Lily Design System home',
  nav: {
    home: 'Home',
    components: 'Components',
    tutorials: 'Tutorials',
    examples: 'Examples',
    skills: 'Skills',
    help: 'Help',
    about: 'About',
    github: 'GitHub'
  },
  footer: {
    license: 'Free open source.',
    trademark: 'Lily™ and Lily Design System™ are trademarks.',
    why: 'Why Lily'
  },
  pickerLabels: {
    theme: 'Theme',
    locale: 'Language',
    textSize: 'Text size',
    share: 'Share',
    link: 'Places',
    search: 'Search',
    searchInput: 'Search terms',
    searchSubmit: 'Search'
  },
  home: {
    heroTitle: 'Build web designs better.',
    heroTagline:
      'Lily is a free, open-source, accessible design system with hundreds of components for nine frameworks.',
    frameworks: 'Supported frameworks',
    tutorials: {
      heading: 'Tutorials',
      description: 'Learn Lily step by step, in whichever framework you use.'
    },
    components: {
      heading: 'Components',
      description:
        'Hundreds of reusable, accessible components, each documented and demonstrated.'
    },
    examples: {
      heading: 'Examples',
      description: 'Seven complete, styled reference applications you can clone and adjust.'
    }
  }
};

// The four English variants share this chrome-string set verbatim: none
// of these particular strings happen to have a US/UK spelling difference
// (no "colour"/"color", "organise"/"organize", etc. among them). The
// divergence that matters for these locales shows up in deeper prose
// content, not in nav/footer/picker labels.
const enGb: UiStrings = en;
const enGbOxendict: UiStrings = en;
const enUs: UiStrings = en;

const es: UiStrings = {
  skipLink: 'Saltar al contenido principal',
  brandAriaLabel: 'Inicio de Lily Design System',
  nav: {
    home: 'Inicio',
    components: 'Componentes',
    tutorials: 'Tutoriales',
    examples: 'Ejemplos',
    skills: 'Habilidades',
    help: 'Ayuda',
    about: 'Acerca de',
    github: 'GitHub'
  },
  footer: {
    license: 'Software libre y de código abierto — BSD, MIT, Apache-2.0, GPL-2.0 o GPL-3.0.',
    trademark: 'Lily™ y Lily Design System™ son marcas registradas.',
    why: 'Por qué Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Idioma',
    textSize: 'Tamaño del texto',
    share: 'Compartir',
    link: 'Lugares',
    search: 'Buscar',
    searchInput: 'Términos de búsqueda',
    searchSubmit: 'Buscar'
  },
  home: {
    heroTitle: 'Diseña mejor para la web.',
    heroTagline:
      'Lily es un sistema de diseño gratuito, de código abierto y accesible, con cientos de componentes para siete frameworks.',
    frameworks: 'Frameworks compatibles',
    tutorials: {
      heading: 'Tutoriales',
      description: 'Aprende Lily paso a paso, en el framework que uses.'
    },
    components: {
      heading: 'Catálogo de componentes',
      description:
        'Cientos de componentes reutilizables y accesibles, cada uno documentado y demostrado.'
    },
    examples: {
      heading: 'Aplicaciones de ejemplo',
      description:
        'Siete aplicaciones de referencia completas y con estilo que puedes clonar y adaptar.'
    }
  }
};

const fr: UiStrings = {
  skipLink: 'Passer au contenu principal',
  brandAriaLabel: 'Accueil de Lily Design System',
  nav: {
    home: 'Accueil',
    components: 'Composants',
    tutorials: 'Tutoriels',
    examples: 'Exemples',
    skills: 'Compétences',
    help: 'Aide',
    about: 'À propos',
    github: 'GitHub'
  },
  footer: {
    license: 'Logiciel libre et open source — BSD, MIT, Apache-2.0, GPL-2.0 ou GPL-3.0.',
    trademark: 'Lily™ et Lily Design System™ sont des marques déposées.',
    why: 'Pourquoi Lily'
  },
  pickerLabels: {
    theme: 'Thème',
    locale: 'Langue',
    textSize: 'Taille du texte',
    share: 'Partager',
    link: 'Places',
    search: 'Rechercher',
    searchInput: 'Termes de recherche',
    searchSubmit: 'Rechercher'
  },
  home: {
    heroTitle: 'Concevez mieux pour le web.',
    heroTagline:
      "Lily est un système de conception gratuit, open source et accessible, avec des centaines de composants pour sept frameworks.",
    frameworks: 'Frameworks pris en charge',
    tutorials: {
      heading: 'Tutoriels',
      description: 'Apprenez Lily étape par étape, dans le framework de votre choix.'
    },
    components: {
      heading: 'Catalogue de composants',
      description:
        'Des centaines de composants réutilisables et accessibles, chacun documenté et illustré.'
    },
    examples: {
      heading: "Applications d'exemple",
      description: 'Sept applications de référence complètes et stylisées, à cloner et adapter.'
    }
  }
};

const pt: UiStrings = {
  skipLink: 'Pular para o conteúdo principal',
  brandAriaLabel: 'Início do Lily Design System',
  nav: {
    home: 'Início',
    components: 'Componentes',
    tutorials: 'Tutoriais',
    examples: 'Exemplos',
    skills: 'Habilidades',
    help: 'Ajuda',
    about: 'Sobre',
    github: 'GitHub'
  },
  footer: {
    license: 'Software livre e de código aberto — BSD, MIT, Apache-2.0, GPL-2.0 ou GPL-3.0.',
    trademark: 'Lily™ e Lily Design System™ são marcas registradas.',
    why: 'Por que Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Idioma',
    textSize: 'Tamanho do texto',
    share: 'Compartilhar',
    link: 'Lugares',
    search: 'Pesquisar',
    searchInput: 'Termos de pesquisa',
    searchSubmit: 'Pesquisar'
  },
  home: {
    heroTitle: 'Crie designs melhores para a web.',
    heroTagline:
      'Lily é um sistema de design gratuito, de código aberto e acessível, com centenas de componentes para sete frameworks.',
    frameworks: 'Frameworks compatíveis',
    tutorials: {
      heading: 'Tutoriais',
      description: 'Aprenda Lily passo a passo, no framework que você usa.'
    },
    components: {
      heading: 'Catálogo de componentes',
      description:
        'Centenas de componentes reutilizáveis e acessíveis, cada um documentado e demonstrado.'
    },
    examples: {
      heading: 'Aplicativos de exemplo',
      description:
        'Sete aplicativos de referência completos e estilizados que você pode clonar e ajustar.'
    }
  }
};

const ru: UiStrings = {
  skipLink: 'Перейти к основному содержимому',
  brandAriaLabel: 'Главная страница Lily Design System',
  nav: {
    home: 'Главная',
    components: 'Компоненты',
    tutorials: 'Уроки',
    examples: 'Примеры',
    skills: 'Навыки',
    help: 'Помощь',
    about: 'О проекте',
    github: 'GitHub'
  },
  footer: {
    license:
      'Бесплатное программное обеспечение с открытым исходным кодом — BSD, MIT, Apache-2.0, GPL-2.0 или GPL-3.0.',
    trademark: 'Lily™ и Lily Design System™ являются товарными знаками.',
    why: 'Почему Lily'
  },
  pickerLabels: {
    theme: 'Тема',
    locale: 'Язык',
    textSize: 'Размер текста',
    share: 'Поделиться',
    link: 'Места',
    search: 'Поиск',
    searchInput: 'Поисковый запрос',
    searchSubmit: 'Найти'
  },
  home: {
    heroTitle: 'Создавайте веб-дизайн лучше.',
    heroTagline:
      'Lily — бесплатная система дизайна с открытым исходным кодом и сотнями доступных компонентов для семи фреймворков.',
    frameworks: 'Поддерживаемые фреймворки',
    tutorials: {
      heading: 'Уроки',
      description: 'Изучайте Lily шаг за шагом на нужном вам фреймворке.'
    },
    components: {
      heading: 'Каталог компонентов',
      description:
        'Сотни переиспользуемых, доступных компонентов — каждый задокументирован и показан в действии.'
    },
    examples: {
      heading: 'Примеры приложений',
      description:
        'Семь полноценных стилизованных эталонных приложений, которые можно клонировать и изменить.'
    }
  }
};

const hi: UiStrings = {
  skipLink: 'मुख्य सामग्री पर जाएँ',
  brandAriaLabel: 'Lily Design System होम',
  nav: {
    home: 'होम',
    components: 'कॉम्पोनेंट्स',
    tutorials: 'ट्यूटोरियल',
    examples: 'उदाहरण',
    skills: 'स्किल्स',
    help: 'सहायता',
    about: 'परिचय',
    github: 'GitHub'
  },
  footer: {
    license: 'निःशुल्क और ओपन-सोर्स — BSD, MIT, Apache-2.0, GPL-2.0, या GPL-3.0।',
    trademark: 'Lily™ और Lily Design System™ ट्रेडमार्क हैं।',
    why: 'Lily क्यों'
  },
  pickerLabels: {
    theme: 'थीम',
    locale: 'भाषा',
    textSize: 'टेक्स्ट का आकार',
    share: 'साझा करें',
    link: 'स्थान',
    search: 'खोजें',
    searchInput: 'खोज शब्द',
    searchSubmit: 'खोजें'
  },
  home: {
    heroTitle: 'वेब डिज़ाइन को बेहतर बनाइए।',
    heroTagline:
      'Lily एक निःशुल्क, ओपन-सोर्स, सुगम्य डिज़ाइन सिस्टम है जिसमें सात फ्रेमवर्क के लिए सैकड़ों कॉम्पोनेंट्स हैं।',
    frameworks: 'समर्थित फ़्रेमवर्क',
    tutorials: {
      heading: 'ट्यूटोरियल',
      description: 'जिस फ्रेमवर्क का आप उपयोग करते हैं, उसमें Lily को चरण-दर-चरण सीखें।'
    },
    components: {
      heading: 'कॉम्पोनेंट कैटलॉग',
      description: 'सैकड़ों पुन: प्रयोज्य, सुगम्य कॉम्पोनेंट्स — हर एक दस्तावेज़ित और प्रदर्शित।'
    },
    examples: {
      heading: 'उदाहरण ऐप्स',
      description: 'सात पूर्ण, स्टाइल किए गए संदर्भ ऐप्स जिन्हें आप क्लोन और समायोजित कर सकते हैं।'
    }
  }
};

const id: UiStrings = {
  skipLink: 'Lewati ke konten utama',
  brandAriaLabel: 'Beranda Lily Design System',
  nav: {
    home: 'Beranda',
    components: 'Komponen',
    tutorials: 'Tutorial',
    examples: 'Contoh',
    skills: 'Keterampilan',
    help: 'Bantuan',
    about: 'Tentang',
    github: 'GitHub'
  },
  footer: {
    license: 'Gratis dan sumber terbuka — BSD, MIT, Apache-2.0, GPL-2.0, atau GPL-3.0.',
    trademark: 'Lily™ dan Lily Design System™ adalah merek dagang.',
    why: 'Mengapa Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Bahasa',
    textSize: 'Ukuran teks',
    share: 'Bagikan',
    link: 'Tempat',
    search: 'Cari',
    searchInput: 'Kata pencarian',
    searchSubmit: 'Cari'
  },
  home: {
    heroTitle: 'Rancang desain web yang lebih baik.',
    heroTagline:
      'Lily adalah sistem desain gratis, sumber terbuka, dan aksesibel dengan ratusan komponen untuk tujuh framework.',
    frameworks: 'Framework yang didukung',
    tutorials: {
      heading: 'Tutorial',
      description: 'Pelajari Lily langkah demi langkah, di framework yang Anda gunakan.'
    },
    components: {
      heading: 'Katalog komponen',
      description:
        'Ratusan komponen yang dapat digunakan kembali dan aksesibel, masing-masing didokumentasikan dan didemonstrasikan.'
    },
    examples: {
      heading: 'Aplikasi contoh',
      description:
        'Tujuh aplikasi referensi lengkap dan bergaya yang dapat Anda kloning dan sesuaikan.'
    }
  }
};

const cy: UiStrings = {
  skipLink: "Neidio i'r prif gynnwys",
  brandAriaLabel: 'Hafan Lily Design System',
  nav: {
    home: 'Hafan',
    components: 'Cydrannau',
    tutorials: 'Tiwtorialau',
    examples: 'Enghreifftiau',
    skills: 'Sgiliau',
    help: 'Cymorth',
    about: 'Amdanom',
    github: 'GitHub'
  },
  footer: {
    license:
      'Meddalwedd ffynhonnell agored am ddim — BSD, MIT, Apache-2.0, GPL-2.0, neu GPL-3.0.',
    trademark: 'Mae Lily™ a Lily Design System™ yn nodau masnach.',
    why: 'Pam Lily'
  },
  pickerLabels: {
    theme: 'Thema',
    locale: 'Iaith',
    textSize: 'Maint testun',
    share: 'Rhannu',
    link: 'Lleoedd',
    search: 'Chwilio',
    searchInput: 'Termau chwilio',
    searchSubmit: 'Chwilio'
  },
  home: {
    heroTitle: 'Dylunio gwefannau yn well.',
    heroTagline:
      "Mae Lily yn system ddylunio ffynhonnell agored am ddim a hygyrch, gyda channoedd o gydrannau ar gyfer saith fframwaith.",
    frameworks: 'Fframweithiau a gefnogir',
    tutorials: {
      heading: 'Tiwtorialau',
      description: "Dysgwch Lily gam wrth gam, yn y fframwaith rydych chi'n ei ddefnyddio."
    },
    components: {
      heading: 'Catalog cydrannau',
      description:
        "Cannoedd o gydrannau hygyrch y gellir eu hailddefnyddio, pob un wedi'i ddogfennu a'i ddangos."
    },
    examples: {
      heading: 'Apiau enghreifftiol',
      description:
        "Saith cymhwysiad cyfeirio cyflawn, wedi'u harddullio, y gallwch eu clonio a'u haddasu."
    }
  }
};

const ar: UiStrings = {
  skipLink: 'الانتقال إلى المحتوى الرئيسي',
  brandAriaLabel: 'الصفحة الرئيسية لـ Lily Design System',
  nav: {
    home: 'الرئيسية',
    components: 'المكوّنات',
    tutorials: 'الدروس',
    examples: 'أمثلة',
    skills: 'المهارات',
    help: 'المساعدة',
    about: 'حول',
    github: 'GitHub'
  },
  footer: {
    license: 'برنامج مجاني ومفتوح المصدر — BSD أو MIT أو Apache-2.0 أو GPL-2.0 أو GPL-3.0.',
    trademark: 'Lily™ وLily Design System™ علامتان تجاريتان.',
    why: 'لماذا Lily'
  },
  pickerLabels: {
    theme: 'السمة',
    locale: 'اللغة',
    textSize: 'حجم النص',
    share: 'مشاركة',
    link: 'الأماكن',
    search: 'بحث',
    searchInput: 'عبارات البحث',
    searchSubmit: 'بحث'
  },
  home: {
    heroTitle: 'صمّم الويب بشكل أفضل.',
    heroTagline: 'Lily نظام تصميم مجاني ومفتوح المصدر ويسهل الوصول إليه، يضم مئات المكوّنات لسبعة أطر عمل.',
    frameworks: 'أطر العمل المدعومة',
    tutorials: {
      heading: 'الدروس',
      description: 'تعلّم Lily خطوة بخطوة، في إطار العمل الذي تستخدمه.'
    },
    components: {
      heading: 'كتالوج المكوّنات',
      description: 'مئات المكوّنات القابلة لإعادة الاستخدام والوصول، كل منها موثّق وموضّح بمثال حي.'
    },
    examples: {
      heading: 'تطبيقات نموذجية',
      description: 'سبعة تطبيقات مرجعية كاملة ومنسّقة يمكنك استنساخها وتعديلها.'
    }
  }
};

const ur: UiStrings = {
  skipLink: 'بنیادی مواد پر جائیں',
  brandAriaLabel: 'Lily Design System کا صفحۂ اول',
  nav: {
    home: 'ہوم',
    components: 'اجزاء',
    tutorials: 'سبق',
    examples: 'مثالیں',
    skills: 'مہارتیں',
    help: 'مدد',
    about: 'تعارف',
    github: 'GitHub'
  },
  footer: {
    license: 'مفت اور اوپن سورس — BSD، MIT، Apache-2.0، GPL-2.0، یا GPL-3.0۔',
    trademark: 'Lily™ اور Lily Design System™ تجارتی نشانات ہیں۔',
    why: 'Lily کیوں'
  },
  pickerLabels: {
    theme: 'تھیم',
    locale: 'زبان',
    textSize: 'متن کا سائز',
    share: 'شیئر کریں',
    link: 'مقامات',
    search: 'تلاش',
    searchInput: 'تلاش کے الفاظ',
    searchSubmit: 'تلاش'
  },
  home: {
    heroTitle: 'ویب ڈیزائن کو بہتر بنائیں۔',
    heroTagline:
      'Lily ایک مفت، اوپن سورس اور قابلِ رسائی ڈیزائن سسٹم ہے جس میں سات فریم ورکس کے لیے سیکڑوں اجزاء شامل ہیں۔',
    frameworks: 'معاون فریم ورکس',
    tutorials: {
      heading: 'سبق',
      description: 'جس فریم ورک میں کام کرتے ہیں اُس میں Lily مرحلہ وار سیکھیں۔'
    },
    components: {
      heading: 'اجزاء کی فہرست',
      description: 'سیکڑوں دوبارہ قابلِ استعمال، قابلِ رسائی اجزاء — ہر ایک دستاویزی اور عملی مثال کے ساتھ۔'
    },
    examples: {
      heading: 'نمونہ ایپس',
      description: 'سات مکمل، ڈیزائن شدہ حوالہ ایپس جنہیں آپ کاپی اور تبدیل کر سکتے ہیں۔'
    }
  }
};

const bn: UiStrings = {
  skipLink: 'মূল বিষয়বস্তুতে যান',
  brandAriaLabel: 'Lily Design System হোম',
  nav: {
    home: 'হোম',
    components: 'কম্পোনেন্ট',
    tutorials: 'টিউটোরিয়াল',
    examples: 'উদাহরণ',
    skills: 'স্কিল',
    help: 'সহায়তা',
    about: 'পরিচিতি',
    github: 'GitHub'
  },
  footer: {
    license: 'বিনামূল্যে ও ওপেন-সোর্স — BSD, MIT, Apache-2.0, GPL-2.0, বা GPL-3.0।',
    trademark: 'Lily™ এবং Lily Design System™ ট্রেডমার্ক।',
    why: 'কেন Lily'
  },
  pickerLabels: {
    theme: 'থিম',
    locale: 'ভাষা',
    textSize: 'টেক্সটের আকার',
    share: 'শেয়ার করুন',
    link: 'স্থানসমূহ',
    search: 'অনুসন্ধান',
    searchInput: 'অনুসন্ধানের শব্দ',
    searchSubmit: 'অনুসন্ধান'
  },
  home: {
    heroTitle: 'ওয়েব ডিজাইন আরও ভালো করুন।',
    heroTagline:
      'Lily একটি বিনামূল্যের, ওপেন-সোর্স, প্রবেশযোগ্য ডিজাইন সিস্টেম, যাতে সাতটি ফ্রেমওয়ার্কের জন্য শত শত কম্পোনেন্ট রয়েছে।',
    frameworks: 'সমর্থিত ফ্রেমওয়ার্ক',
    tutorials: {
      heading: 'টিউটোরিয়াল',
      description: 'আপনি যে ফ্রেমওয়ার্ক ব্যবহার করেন, তাতে ধাপে ধাপে Lily শিখুন।'
    },
    components: {
      heading: 'কম্পোনেন্ট ক্যাটালগ',
      description: 'শত শত পুনঃব্যবহারযোগ্য, প্রবেশযোগ্য কম্পোনেন্ট — প্রতিটি নথিভুক্ত ও প্রদর্শিত।'
    },
    examples: {
      heading: 'উদাহরণ অ্যাপ',
      description: 'সাতটি সম্পূর্ণ, স্টাইল করা রেফারেন্স অ্যাপ, যা আপনি ক্লোন করে সামঞ্জস্য করতে পারেন।'
    }
  }
};

const zh: UiStrings = {
  skipLink: '跳到主要内容',
  brandAriaLabel: 'Lily Design System 首页',
  nav: {
    home: '首页',
    components: '组件',
    tutorials: '教程',
    examples: '示例',
    skills: '技能',
    help: '帮助',
    about: '关于',
    github: 'GitHub'
  },
  footer: {
    license: '免费开源软件 — BSD、MIT、Apache-2.0、GPL-2.0 或 GPL-3.0。',
    trademark: 'Lily™ 和 Lily Design System™ 是商标。',
    why: '为什么选择 Lily'
  },
  pickerLabels: {
    theme: '主题',
    locale: '语言',
    textSize: '文字大小',
    share: '分享',
    link: '地点',
    search: '搜索',
    searchInput: '搜索词',
    searchSubmit: '搜索'
  },
  home: {
    heroTitle: '更好地设计网页。',
    heroTagline: 'Lily 是一个免费、开源、无障碍的设计系统,为七种框架提供数百个组件。',
    frameworks: '支持的框架',
    tutorials: {
      heading: '教程',
      description: '在你使用的框架中,按部就班地学习 Lily。'
    },
    components: {
      heading: '组件目录',
      description: '数百个可复用、无障碍的组件,每个都有文档和演示。'
    },
    examples: {
      heading: '示例应用',
      description: '七个完整、带样式的参考应用,你可以克隆并自行调整。'
    }
  }
};

const ja: UiStrings = {
  skipLink: 'メインコンテンツへスキップ',
  brandAriaLabel: 'Lily Design System ホーム',
  nav: {
    home: 'ホーム',
    components: 'コンポーネント',
    tutorials: 'チュートリアル',
    examples: 'サンプル',
    skills: 'スキル',
    help: 'ヘルプ',
    about: '概要',
    github: 'GitHub'
  },
  footer: {
    license: '無料のオープンソース — BSD、MIT、Apache-2.0、GPL-2.0、または GPL-3.0。',
    trademark: 'Lily™ および Lily Design System™ は商標です。',
    why: 'Lily を選ぶ理由'
  },
  pickerLabels: {
    theme: 'テーマ',
    locale: '言語',
    textSize: '文字サイズ',
    share: '共有',
    link: 'ページ',
    search: '検索',
    searchInput: '検索語',
    searchSubmit: '検索'
  },
  home: {
    heroTitle: 'ウェブデザインをもっと良く。',
    heroTagline: 'Lily は、7 つのフレームワーク向けに数百のコンポーネントを備えた、無料でオープンソースのアクセシブルなデザインシステムです。',
    frameworks: '対応フレームワーク',
    tutorials: { heading: 'チュートリアル', description: 'お使いのフレームワークで、Lily を一歩ずつ学べます。' },
    components: { heading: 'コンポーネント', description: '再利用できるアクセシブルなコンポーネントが数百あり、それぞれにドキュメントとデモがあります。' },
    examples: { heading: 'サンプル', description: 'クローンして調整できる、スタイル付きの完全なリファレンスアプリケーションが 7 つあります。' }
  }
};

const ko: UiStrings = {
  skipLink: '본문으로 건너뛰기',
  brandAriaLabel: 'Lily Design System 홈',
  nav: {
    home: '홈',
    components: '컴포넌트',
    tutorials: '튜토리얼',
    examples: '예제',
    skills: '스킬',
    help: '도움말',
    about: '소개',
    github: 'GitHub'
  },
  footer: {
    license: '무료 오픈 소스 — BSD, MIT, Apache-2.0, GPL-2.0 또는 GPL-3.0.',
    trademark: 'Lily™ 및 Lily Design System™은 상표입니다.',
    why: 'Lily를 선택하는 이유'
  },
  pickerLabels: {
    theme: '테마',
    locale: '언어',
    textSize: '글자 크기',
    share: '공유',
    link: '페이지',
    search: '검색',
    searchInput: '검색어',
    searchSubmit: '검색'
  },
  home: {
    heroTitle: '웹 디자인을 더 잘 만드세요.',
    heroTagline: 'Lily는 일곱 가지 프레임워크를 위한 수백 개의 컴포넌트를 갖춘 무료 오픈 소스 접근성 디자인 시스템입니다.',
    frameworks: '지원 프레임워크',
    tutorials: { heading: '튜토리얼', description: '사용하는 프레임워크에서 Lily를 단계별로 배워 보세요.' },
    components: { heading: '컴포넌트', description: '재사용 가능한 접근성 컴포넌트 수백 개, 각각 문서와 데모가 있습니다.' },
    examples: { heading: '예제', description: '복제해서 조정할 수 있는, 스타일이 적용된 완전한 참조 애플리케이션 일곱 개.' }
  }
};

const sw: UiStrings = {
  skipLink: 'Ruka hadi maudhui makuu',
  brandAriaLabel: 'Ukurasa wa mwanzo wa Lily Design System',
  nav: {
    home: 'Mwanzo',
    components: 'Vipengele',
    tutorials: 'Mafunzo',
    examples: 'Mifano',
    skills: 'Stadi',
    help: 'Msaada',
    about: 'Kuhusu',
    github: 'GitHub'
  },
  footer: {
    license: 'Programu huria ya chanzo wazi bila malipo — BSD, MIT, Apache-2.0, GPL-2.0 au GPL-3.0.',
    trademark: 'Lily™ na Lily Design System™ ni alama za biashara.',
    why: 'Kwa nini Lily'
  },
  pickerLabels: {
    theme: 'Mandhari',
    locale: 'Lugha',
    textSize: 'Ukubwa wa maandishi',
    share: 'Shiriki',
    link: 'Maeneo',
    search: 'Tafuta',
    searchInput: 'Maneno ya kutafuta',
    searchSubmit: 'Tafuta'
  },
  home: {
    heroTitle: 'Buni tovuti kwa ubora zaidi.',
    heroTagline: 'Lily ni mfumo wa usanifu huria, wa chanzo wazi na unaofikika, wenye mamia ya vipengele kwa mifumo saba ya kazi.',
    frameworks: 'Mifumo ya kazi inayotumika',
    tutorials: { heading: 'Mafunzo', description: 'Jifunze Lily hatua kwa hatua, katika mfumo wowote unaotumia.' },
    components: { heading: 'Vipengele', description: 'Mamia ya vipengele vinavyoweza kutumika tena na vinavyofikika, kila kimoja kikiwa na nyaraka na onyesho.' },
    examples: { heading: 'Mifano', description: 'Programu saba kamili za marejeo zenye mitindo ambazo unaweza kunakili na kurekebisha.' }
  }
};

const sv: UiStrings = {
  skipLink: 'Hoppa till huvudinnehållet',
  brandAriaLabel: 'Lily Design System startsida',
  nav: {
    home: 'Start',
    components: 'Komponenter',
    tutorials: 'Handledningar',
    examples: 'Exempel',
    skills: 'Färdigheter',
    help: 'Hjälp',
    about: 'Om',
    github: 'GitHub'
  },
  footer: {
    license: 'Gratis öppen källkod — BSD, MIT, Apache-2.0, GPL-2.0 eller GPL-3.0.',
    trademark: 'Lily™ och Lily Design System™ är varumärken.',
    why: 'Varför Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Språk',
    textSize: 'Textstorlek',
    share: 'Dela',
    link: 'Platser',
    search: 'Sök',
    searchInput: 'Sökord',
    searchSubmit: 'Sök'
  },
  home: {
    heroTitle: 'Bygg bättre webbdesign.',
    heroTagline: 'Lily är ett gratis, tillgängligt designsystem med öppen källkod och hundratals komponenter för sju ramverk.',
    frameworks: 'Ramverk som stöds',
    tutorials: { heading: 'Handledningar', description: 'Lär dig Lily steg för steg, i det ramverk du använder.' },
    components: { heading: 'Komponenter', description: 'Hundratals återanvändbara, tillgängliga komponenter, alla dokumenterade och demonstrerade.' },
    examples: { heading: 'Exempel', description: 'Sju kompletta, stilsatta referensapplikationer som du kan klona och anpassa.' }
  }
};

const nl: UiStrings = {
  skipLink: 'Direct naar de hoofdinhoud',
  brandAriaLabel: 'Startpagina van Lily Design System',
  nav: {
    home: 'Home',
    components: 'Componenten',
    tutorials: 'Handleidingen',
    examples: 'Voorbeelden',
    skills: 'Vaardigheden',
    help: 'Help',
    about: 'Over',
    github: 'GitHub'
  },
  footer: {
    license: 'Gratis opensourcesoftware — BSD, MIT, Apache-2.0, GPL-2.0 of GPL-3.0.',
    trademark: 'Lily™ en Lily Design System™ zijn handelsmerken.',
    why: 'Waarom Lily'
  },
  pickerLabels: {
    theme: 'Thema',
    locale: 'Taal',
    textSize: 'Tekstgrootte',
    share: 'Delen',
    link: 'Plaatsen',
    search: 'Zoeken',
    searchInput: 'Zoektermen',
    searchSubmit: 'Zoeken'
  },
  home: {
    heroTitle: 'Ontwerp betere websites.',
    heroTagline: 'Lily is een gratis, toegankelijk designsysteem met open source en honderden componenten voor zeven frameworks.',
    frameworks: 'Ondersteunde frameworks',
    tutorials: { heading: 'Handleidingen', description: 'Leer Lily stap voor stap, in het framework dat je gebruikt.' },
    components: { heading: 'Componenten', description: 'Honderden herbruikbare, toegankelijke componenten, elk gedocumenteerd en gedemonstreerd.' },
    examples: { heading: 'Voorbeelden', description: 'Zeven complete, opgemaakte referentietoepassingen die je kunt klonen en aanpassen.' }
  }
};

const de: UiStrings = {
  skipLink: 'Zum Hauptinhalt springen',
  brandAriaLabel: 'Startseite von Lily Design System',
  nav: {
    home: 'Start',
    components: 'Komponenten',
    tutorials: 'Anleitungen',
    examples: 'Beispiele',
    skills: 'Skills',
    help: 'Hilfe',
    about: 'Über',
    github: 'GitHub'
  },
  footer: {
    license: 'Freie Open-Source-Software — BSD, MIT, Apache-2.0, GPL-2.0 oder GPL-3.0.',
    trademark: 'Lily™ und Lily Design System™ sind Marken.',
    why: 'Warum Lily'
  },
  pickerLabels: {
    theme: 'Design',
    locale: 'Sprache',
    textSize: 'Textgröße',
    share: 'Teilen',
    link: 'Orte',
    search: 'Suchen',
    searchInput: 'Suchbegriffe',
    searchSubmit: 'Suchen'
  },
  home: {
    heroTitle: 'Webdesign besser machen.',
    heroTagline: 'Lily ist ein kostenloses, barrierefreies Open-Source-Designsystem mit Hunderten von Komponenten für sieben Frameworks.',
    frameworks: 'Unterstützte Frameworks',
    tutorials: { heading: 'Anleitungen', description: 'Lernen Sie Lily Schritt für Schritt, in dem Framework, das Sie verwenden.' },
    components: { heading: 'Komponenten', description: 'Hunderte wiederverwendbare, barrierefreie Komponenten, jede dokumentiert und vorgeführt.' },
    examples: { heading: 'Beispiele', description: 'Sieben vollständige, gestaltete Referenzanwendungen, die Sie klonen und anpassen können.' }
  }
};

const da: UiStrings = {
  skipLink: 'Gå til hovedindholdet',
  brandAriaLabel: 'Startside for Lily Design System',
  nav: {
    home: 'Hjem',
    components: 'Komponenter',
    tutorials: 'Vejledninger',
    examples: 'Eksempler',
    skills: 'Færdigheder',
    help: 'Hjælp',
    about: 'Om',
    github: 'GitHub'
  },
  footer: {
    license: 'Gratis open source — BSD, MIT, Apache-2.0, GPL-2.0 eller GPL-3.0.',
    trademark: 'Lily™ og Lily Design System™ er varemærker.',
    why: 'Hvorfor Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Sprog',
    textSize: 'Tekststørrelse',
    share: 'Del',
    link: 'Steder',
    search: 'Søg',
    searchInput: 'Søgeord',
    searchSubmit: 'Søg'
  },
  home: {
    heroTitle: 'Design bedre til nettet.',
    heroTagline: 'Lily er et gratis, tilgængeligt designsystem med åben kildekode og hundredvis af komponenter til syv frameworks.',
    frameworks: 'Understøttede frameworks',
    tutorials: { heading: 'Vejledninger', description: 'Lær Lily trin for trin i det framework, du bruger.' },
    components: { heading: 'Komponenter', description: 'Hundredvis af genbrugelige, tilgængelige komponenter, alle dokumenteret og demonstreret.' },
    examples: { heading: 'Eksempler', description: 'Syv komplette, stilede referenceapplikationer, som du kan klone og tilpasse.' }
  }
};

const th: UiStrings = {
  skipLink: 'ข้ามไปยังเนื้อหาหลัก',
  brandAriaLabel: 'หน้าแรกของ Lily Design System',
  nav: {
    home: 'หน้าแรก',
    components: 'คอมโพเนนต์',
    tutorials: 'บทเรียน',
    examples: 'ตัวอย่าง',
    skills: 'สกิล',
    help: 'ช่วยเหลือ',
    about: 'เกี่ยวกับ',
    github: 'GitHub'
  },
  footer: {
    license: 'ซอฟต์แวร์โอเพนซอร์สฟรี — BSD, MIT, Apache-2.0, GPL-2.0 หรือ GPL-3.0',
    trademark: 'Lily™ และ Lily Design System™ เป็นเครื่องหมายการค้า',
    why: 'ทำไมต้อง Lily'
  },
  pickerLabels: {
    theme: 'ธีม',
    locale: 'ภาษา',
    textSize: 'ขนาดข้อความ',
    share: 'แชร์',
    link: 'สถานที่',
    search: 'ค้นหา',
    searchInput: 'คำค้นหา',
    searchSubmit: 'ค้นหา'
  },
  home: {
    heroTitle: 'ออกแบบเว็บให้ดียิ่งขึ้น',
    heroTagline: 'Lily เป็นระบบการออกแบบโอเพนซอร์สฟรีที่เข้าถึงได้ พร้อมคอมโพเนนต์หลายร้อยรายการสำหรับเจ็ดเฟรมเวิร์ก',
    frameworks: 'เฟรมเวิร์กที่รองรับ',
    tutorials: { heading: 'บทเรียน', description: 'เรียนรู้ Lily ทีละขั้นตอน ในเฟรมเวิร์กที่คุณใช้' },
    components: { heading: 'คอมโพเนนต์', description: 'คอมโพเนนต์ที่นำกลับมาใช้ซ้ำได้และเข้าถึงได้หลายร้อยรายการ พร้อมเอกสารและตัวอย่างการใช้งาน' },
    examples: { heading: 'ตัวอย่าง', description: 'แอปพลิเคชันอ้างอิงที่ออกแบบเสร็จสมบูรณ์เจ็ดแอป ที่คุณโคลนและปรับแต่งได้' }
  }
};

const et: UiStrings = {
  skipLink: 'Liigu põhisisu juurde',
  brandAriaLabel: 'Lily Design Systemi avaleht',
  nav: {
    home: 'Avaleht',
    components: 'Komponendid',
    tutorials: 'Õpetused',
    examples: 'Näited',
    skills: 'Oskused',
    help: 'Abi',
    about: 'Teave',
    github: 'GitHub'
  },
  footer: {
    license: 'Tasuta avatud lähtekoodiga tarkvara — BSD, MIT, Apache-2.0, GPL-2.0 või GPL-3.0.',
    trademark: 'Lily™ ja Lily Design System™ on kaubamärgid.',
    why: 'Miks Lily'
  },
  pickerLabels: {
    theme: 'Teema',
    locale: 'Keel',
    textSize: 'Teksti suurus',
    share: 'Jaga',
    link: 'Kohad',
    search: 'Otsi',
    searchInput: 'Otsingusõnad',
    searchSubmit: 'Otsi'
  },
  home: {
    heroTitle: 'Kujunda veebi paremini.',
    heroTagline: 'Lily on tasuta ja avatud lähtekoodiga juurdepääsetav disainisüsteem sadade komponentidega seitsmele raamistikule.',
    frameworks: 'Toetatud raamistikud',
    tutorials: { heading: 'Õpetused', description: 'Õpi Lilyt samm-sammult selles raamistikus, mida kasutad.' },
    components: { heading: 'Komponendid', description: 'Sadu taaskasutatavaid ja juurdepääsetavaid komponente, igaühel dokumentatsioon ja demo.' },
    examples: { heading: 'Näited', description: 'Seitse täielikku, kujundatud näiterakendust, mida saad kloonida ja kohandada.' }
  }
};

const fi: UiStrings = {
  skipLink: 'Siirry pääsisältöön',
  brandAriaLabel: 'Lily Design Systemin etusivu',
  nav: {
    home: 'Etusivu',
    components: 'Komponentit',
    tutorials: 'Opetusohjelmat',
    examples: 'Esimerkit',
    skills: 'Taidot',
    help: 'Ohje',
    about: 'Tietoa',
    github: 'GitHub'
  },
  footer: {
    license: 'Ilmainen avoimen lähdekoodin ohjelmisto — BSD, MIT, Apache-2.0, GPL-2.0 tai GPL-3.0.',
    trademark: 'Lily™ ja Lily Design System™ ovat tavaramerkkejä.',
    why: 'Miksi Lily'
  },
  pickerLabels: {
    theme: 'Teema',
    locale: 'Kieli',
    textSize: 'Tekstin koko',
    share: 'Jaa',
    link: 'Paikat',
    search: 'Haku',
    searchInput: 'Hakusanat',
    searchSubmit: 'Hae'
  },
  home: {
    heroTitle: 'Suunnittele verkkoa paremmin.',
    heroTagline: 'Lily on ilmainen, avoimen lähdekoodin saavutettava suunnittelujärjestelmä, jossa on satoja komponentteja seitsemälle kehykselle.',
    frameworks: 'Tuetut kehykset',
    tutorials: { heading: 'Opetusohjelmat', description: 'Opi Lily askel askeleelta käyttämässäsi kehyksessä.' },
    components: { heading: 'Komponentit', description: 'Satoja uudelleenkäytettäviä, saavutettavia komponentteja, jokainen dokumentoitu ja esitelty.' },
    examples: { heading: 'Esimerkit', description: 'Seitsemän täydellistä, tyylitettyä esimerkkisovellusta, jotka voit kloonata ja muokata.' }
  }
};

const it: UiStrings = {
  skipLink: 'Salta al contenuto principale',
  brandAriaLabel: 'Pagina iniziale di Lily Design System',
  nav: {
    home: 'Home',
    components: 'Componenti',
    tutorials: 'Tutorial',
    examples: 'Esempi',
    skills: 'Competenze',
    help: 'Aiuto',
    about: 'Informazioni',
    github: 'GitHub'
  },
  footer: {
    license: 'Software libero e open source — BSD, MIT, Apache-2.0, GPL-2.0 o GPL-3.0.',
    trademark: 'Lily™ e Lily Design System™ sono marchi.',
    why: 'Perché Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Lingua',
    textSize: 'Dimensione del testo',
    share: 'Condividi',
    link: 'Luoghi',
    search: 'Cerca',
    searchInput: 'Termini di ricerca',
    searchSubmit: 'Cerca'
  },
  home: {
    heroTitle: 'Progetta meglio per il web.',
    heroTagline: 'Lily è un design system gratuito, open source e accessibile, con centinaia di componenti per sette framework.',
    frameworks: 'Framework supportati',
    tutorials: { heading: 'Tutorial', description: 'Impara Lily passo dopo passo, nel framework che usi.' },
    components: { heading: 'Componenti', description: 'Centinaia di componenti riutilizzabili e accessibili, ciascuno documentato e dimostrato.' },
    examples: { heading: 'Esempi', description: 'Sette applicazioni di riferimento complete e con stile, che puoi clonare e adattare.' }
  }
};

const tr: UiStrings = {
  skipLink: 'Ana içeriğe geç',
  brandAriaLabel: 'Lily Design System ana sayfası',
  nav: {
    home: 'Ana sayfa',
    components: 'Bileşenler',
    tutorials: 'Eğitimler',
    examples: 'Örnekler',
    skills: 'Beceriler',
    help: 'Yardım',
    about: 'Hakkında',
    github: 'GitHub'
  },
  footer: {
    license: 'Ücretsiz açık kaynak — BSD, MIT, Apache-2.0, GPL-2.0 veya GPL-3.0.',
    trademark: 'Lily™ ve Lily Design System™ ticari markalardır.',
    why: 'Neden Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Dil',
    textSize: 'Metin boyutu',
    share: 'Paylaş',
    link: 'Yerler',
    search: 'Ara',
    searchInput: 'Arama terimleri',
    searchSubmit: 'Ara'
  },
  home: {
    heroTitle: 'Web tasarımını daha iyi yapın.',
    heroTagline: 'Lily, yedi çerçeve için yüzlerce bileşen sunan ücretsiz, açık kaynaklı ve erişilebilir bir tasarım sistemidir.',
    frameworks: 'Desteklenen çerçeveler',
    tutorials: { heading: 'Eğitimler', description: 'Lily\'yi kullandığınız çerçevede adım adım öğrenin.' },
    components: { heading: 'Bileşenler', description: 'Yüzlerce yeniden kullanılabilir, erişilebilir bileşen; her biri belgelenmiş ve gösterilmiştir.' },
    examples: { heading: 'Örnekler', description: 'Klonlayıp uyarlayabileceğiniz, yedi eksiksiz ve biçimlendirilmiş referans uygulama.' }
  }
};

const vi: UiStrings = {
  skipLink: 'Chuyển đến nội dung chính',
  brandAriaLabel: 'Trang chủ Lily Design System',
  nav: {
    home: 'Trang chủ',
    components: 'Thành phần',
    tutorials: 'Hướng dẫn',
    examples: 'Ví dụ',
    skills: 'Kỹ năng',
    help: 'Trợ giúp',
    about: 'Giới thiệu',
    github: 'GitHub'
  },
  footer: {
    license: 'Phần mềm mã nguồn mở miễn phí — BSD, MIT, Apache-2.0, GPL-2.0 hoặc GPL-3.0.',
    trademark: 'Lily™ và Lily Design System™ là các nhãn hiệu.',
    why: 'Vì sao chọn Lily'
  },
  pickerLabels: {
    theme: 'Giao diện',
    locale: 'Ngôn ngữ',
    textSize: 'Cỡ chữ',
    share: 'Chia sẻ',
    link: 'Địa điểm',
    search: 'Tìm kiếm',
    searchInput: 'Từ khóa tìm kiếm',
    searchSubmit: 'Tìm kiếm'
  },
  home: {
    heroTitle: 'Thiết kế web tốt hơn.',
    heroTagline: 'Lily là hệ thống thiết kế miễn phí, mã nguồn mở và dễ tiếp cận, với hàng trăm thành phần cho bảy framework.',
    frameworks: 'Các framework được hỗ trợ',
    tutorials: { heading: 'Hướng dẫn', description: 'Học Lily từng bước, trong framework bạn đang dùng.' },
    components: { heading: 'Thành phần', description: 'Hàng trăm thành phần có thể tái sử dụng và dễ tiếp cận, mỗi thành phần đều có tài liệu và bản trình diễn.' },
    examples: { heading: 'Ví dụ', description: 'Bảy ứng dụng tham chiếu hoàn chỉnh, có định dạng, để bạn sao chép và điều chỉnh.' }
  }
};

const pl: UiStrings = {
  skipLink: 'Przejdź do głównej treści',
  brandAriaLabel: 'Strona główna Lily Design System',
  nav: {
    home: 'Start',
    components: 'Komponenty',
    tutorials: 'Samouczki',
    examples: 'Przykłady',
    skills: 'Umiejętności',
    help: 'Pomoc',
    about: 'O projekcie',
    github: 'GitHub'
  },
  footer: {
    license: 'Darmowe oprogramowanie open source — BSD, MIT, Apache-2.0, GPL-2.0 lub GPL-3.0.',
    trademark: 'Lily™ i Lily Design System™ są znakami towarowymi.',
    why: 'Dlaczego Lily'
  },
  pickerLabels: {
    theme: 'Motyw',
    locale: 'Język',
    textSize: 'Rozmiar tekstu',
    share: 'Udostępnij',
    link: 'Miejsca',
    search: 'Szukaj',
    searchInput: 'Wyszukiwane hasła',
    searchSubmit: 'Szukaj'
  },
  home: {
    heroTitle: 'Projektuj lepsze strony internetowe.',
    heroTagline: 'Lily to darmowy, dostępny system projektowy open source z setkami komponentów dla siedmiu frameworków.',
    frameworks: 'Obsługiwane frameworki',
    tutorials: { heading: 'Samouczki', description: 'Poznawaj Lily krok po kroku, w używanym przez siebie frameworku.' },
    components: { heading: 'Komponenty', description: 'Setki wielokrotnego użytku, dostępnych komponentów, każdy z dokumentacją i demonstracją.' },
    examples: { heading: 'Przykłady', description: 'Siedem kompletnych, ostylowanych aplikacji referencyjnych, które możesz sklonować i dostosować.' }
  }
};

const ro: UiStrings = {
  skipLink: 'Salt la conținutul principal',
  brandAriaLabel: 'Pagina de start Lily Design System',
  nav: {
    home: 'Acasă',
    components: 'Componente',
    tutorials: 'Tutoriale',
    examples: 'Exemple',
    skills: 'Abilități',
    help: 'Ajutor',
    about: 'Despre',
    github: 'GitHub'
  },
  footer: {
    license: 'Software gratuit și open source — BSD, MIT, Apache-2.0, GPL-2.0 sau GPL-3.0.',
    trademark: 'Lily™ și Lily Design System™ sunt mărci comerciale.',
    why: 'De ce Lily'
  },
  pickerLabels: {
    theme: 'Temă',
    locale: 'Limbă',
    textSize: 'Dimensiunea textului',
    share: 'Distribuie',
    link: 'Locuri',
    search: 'Căutare',
    searchInput: 'Termeni de căutare',
    searchSubmit: 'Caută'
  },
  home: {
    heroTitle: 'Proiectează mai bine pentru web.',
    heroTagline: 'Lily este un sistem de design gratuit, open source și accesibil, cu sute de componente pentru șapte framework-uri.',
    frameworks: 'Framework-uri acceptate',
    tutorials: { heading: 'Tutoriale', description: 'Învață Lily pas cu pas, în framework-ul pe care îl folosești.' },
    components: { heading: 'Componente', description: 'Sute de componente reutilizabile și accesibile, fiecare documentată și demonstrată.' },
    examples: { heading: 'Exemple', description: 'Șapte aplicații de referință complete și stilizate, pe care le poți clona și adapta.' }
  }
};

const cs: UiStrings = {
  skipLink: 'Přejít na hlavní obsah',
  brandAriaLabel: 'Domovská stránka Lily Design System',
  nav: {
    home: 'Domů',
    components: 'Komponenty',
    tutorials: 'Návody',
    examples: 'Příklady',
    skills: 'Dovednosti',
    help: 'Nápověda',
    about: 'O projektu',
    github: 'GitHub'
  },
  footer: {
    license: 'Svobodný software s otevřeným zdrojovým kódem — BSD, MIT, Apache-2.0, GPL-2.0 nebo GPL-3.0.',
    trademark: 'Lily™ a Lily Design System™ jsou ochranné známky.',
    why: 'Proč Lily'
  },
  pickerLabels: {
    theme: 'Motiv',
    locale: 'Jazyk',
    textSize: 'Velikost textu',
    share: 'Sdílet',
    link: 'Místa',
    search: 'Hledat',
    searchInput: 'Hledané výrazy',
    searchSubmit: 'Hledat'
  },
  home: {
    heroTitle: 'Navrhujte weby lépe.',
    heroTagline: 'Lily je bezplatný, přístupný designový systém s otevřeným zdrojovým kódem a stovkami komponent pro sedm frameworků.',
    frameworks: 'Podporované frameworky',
    tutorials: { heading: 'Návody', description: 'Naučte se Lily krok za krokem v frameworku, který používáte.' },
    components: { heading: 'Komponenty', description: 'Stovky opakovaně použitelných, přístupných komponent, každá s dokumentací a ukázkou.' },
    examples: { heading: 'Příklady', description: 'Sedm kompletních, nastylovaných referenčních aplikací, které můžete naklonovat a upravit.' }
  }
};

const hu: UiStrings = {
  skipLink: 'Ugrás a fő tartalomra',
  brandAriaLabel: 'A Lily Design System kezdőlapja',
  nav: {
    home: 'Kezdőlap',
    components: 'Komponensek',
    tutorials: 'Oktatóanyagok',
    examples: 'Példák',
    skills: 'Készségek',
    help: 'Súgó',
    about: 'Névjegy',
    github: 'GitHub'
  },
  footer: {
    license: 'Ingyenes, nyílt forráskódú szoftver — BSD, MIT, Apache-2.0, GPL-2.0 vagy GPL-3.0.',
    trademark: 'A Lily™ és a Lily Design System™ védjegyek.',
    why: 'Miért a Lily'
  },
  pickerLabels: {
    theme: 'Téma',
    locale: 'Nyelv',
    textSize: 'Szövegméret',
    share: 'Megosztás',
    link: 'Helyek',
    search: 'Keresés',
    searchInput: 'Keresési kifejezések',
    searchSubmit: 'Keresés'
  },
  home: {
    heroTitle: 'Tervezz jobb weboldalakat.',
    heroTagline: 'A Lily ingyenes, nyílt forráskódú, akadálymentes tervezőrendszer, több száz komponenssel hét keretrendszerhez.',
    frameworks: 'Támogatott keretrendszerek',
    tutorials: { heading: 'Oktatóanyagok', description: 'Tanuld meg a Lilyt lépésről lépésre, a használt keretrendszerben.' },
    components: { heading: 'Komponensek', description: 'Több száz újrafelhasználható, akadálymentes komponens, mindegyik dokumentált és bemutatott.' },
    examples: { heading: 'Példák', description: 'Hét teljes, stílusos referenciaalkalmazás, amelyeket klónozhatsz és módosíthatsz.' }
  }
};

const el: UiStrings = {
  skipLink: 'Μετάβαση στο κύριο περιεχόμενο',
  brandAriaLabel: 'Αρχική σελίδα του Lily Design System',
  nav: {
    home: 'Αρχική',
    components: 'Στοιχεία',
    tutorials: 'Οδηγοί',
    examples: 'Παραδείγματα',
    skills: 'Δεξιότητες',
    help: 'Βοήθεια',
    about: 'Σχετικά',
    github: 'GitHub'
  },
  footer: {
    license: 'Δωρεάν λογισμικό ανοιχτού κώδικα — BSD, MIT, Apache-2.0, GPL-2.0 ή GPL-3.0.',
    trademark: 'Τα Lily™ και Lily Design System™ είναι εμπορικά σήματα.',
    why: 'Γιατί Lily'
  },
  pickerLabels: {
    theme: 'Θέμα',
    locale: 'Γλώσσα',
    textSize: 'Μέγεθος κειμένου',
    share: 'Κοινοποίηση',
    link: 'Τοποθεσίες',
    search: 'Αναζήτηση',
    searchInput: 'Όροι αναζήτησης',
    searchSubmit: 'Αναζήτηση'
  },
  home: {
    heroTitle: 'Σχεδιάστε καλύτερα για το διαδίκτυο.',
    heroTagline: 'Το Lily είναι ένα δωρεάν, προσβάσιμο σύστημα σχεδίασης ανοιχτού κώδικα με εκατοντάδες στοιχεία για επτά πλαίσια.',
    frameworks: 'Υποστηριζόμενα πλαίσια',
    tutorials: { heading: 'Οδηγοί', description: 'Μάθετε το Lily βήμα προς βήμα, στο πλαίσιο που χρησιμοποιείτε.' },
    components: { heading: 'Στοιχεία', description: 'Εκατοντάδες επαναχρησιμοποιήσιμα, προσβάσιμα στοιχεία, καθένα τεκμηριωμένο και με επίδειξη.' },
    examples: { heading: 'Παραδείγματα', description: 'Επτά πλήρεις εφαρμογές αναφοράς με στυλ, που μπορείτε να κλωνοποιήσετε και να προσαρμόσετε.' }
  }
};

const bg: UiStrings = {
  skipLink: 'Към основното съдържание',
  brandAriaLabel: 'Начална страница на Lily Design System',
  nav: {
    home: 'Начало',
    components: 'Компоненти',
    tutorials: 'Уроци',
    examples: 'Примери',
    skills: 'Умения',
    help: 'Помощ',
    about: 'За проекта',
    github: 'GitHub'
  },
  footer: {
    license: 'Безплатен софтуер с отворен код — BSD, MIT, Apache-2.0, GPL-2.0 или GPL-3.0.',
    trademark: 'Lily™ и Lily Design System™ са търговски марки.',
    why: 'Защо Lily'
  },
  pickerLabels: {
    theme: 'Тема',
    locale: 'Език',
    textSize: 'Размер на текста',
    share: 'Споделяне',
    link: 'Места',
    search: 'Търсене',
    searchInput: 'Думи за търсене',
    searchSubmit: 'Търси'
  },
  home: {
    heroTitle: 'Проектирайте по-добре за уеб.',
    heroTagline: 'Lily е безплатна, достъпна дизайн система с отворен код със стотици компоненти за седем фреймуърка.',
    frameworks: 'Поддържани фреймуърци',
    tutorials: { heading: 'Уроци', description: 'Научете Lily стъпка по стъпка във фреймуърка, който използвате.' },
    components: { heading: 'Компоненти', description: 'Стотици многократно използваеми, достъпни компоненти, всеки с документация и демонстрация.' },
    examples: { heading: 'Примери', description: 'Седем пълни, стилизирани примерни приложения, които можете да клонирате и адаптирате.' }
  }
};

const sk: UiStrings = {
  skipLink: 'Prejsť na hlavný obsah',
  brandAriaLabel: 'Domovská stránka Lily Design System',
  nav: {
    home: 'Domov',
    components: 'Komponenty',
    tutorials: 'Návody',
    examples: 'Príklady',
    skills: 'Zručnosti',
    help: 'Pomoc',
    about: 'O projekte',
    github: 'GitHub'
  },
  footer: {
    license: 'Slobodný softvér s otvoreným zdrojovým kódom — BSD, MIT, Apache-2.0, GPL-2.0 alebo GPL-3.0.',
    trademark: 'Lily™ a Lily Design System™ sú ochranné známky.',
    why: 'Prečo Lily'
  },
  pickerLabels: {
    theme: 'Motív',
    locale: 'Jazyk',
    textSize: 'Veľkosť textu',
    share: 'Zdieľať',
    link: 'Miesta',
    search: 'Hľadať',
    searchInput: 'Hľadané výrazy',
    searchSubmit: 'Hľadať'
  },
  home: {
    heroTitle: 'Navrhujte weby lepšie.',
    heroTagline: 'Lily je bezplatný, prístupný dizajnový systém s otvoreným zdrojovým kódom a stovkami komponentov pre sedem frameworkov.',
    frameworks: 'Podporované frameworky',
    tutorials: { heading: 'Návody', description: 'Naučte sa Lily krok za krokom vo frameworku, ktorý používate.' },
    components: { heading: 'Komponenty', description: 'Stovky opakovane použiteľných, prístupných komponentov, každý s dokumentáciou a ukážkou.' },
    examples: { heading: 'Príklady', description: 'Sedem kompletných, ostylovaných referenčných aplikácií, ktoré môžete naklonovať a upraviť.' }
  }
};

const hr: UiStrings = {
  skipLink: 'Preskoči na glavni sadržaj',
  brandAriaLabel: 'Početna stranica Lily Design Systema',
  nav: {
    home: 'Početna',
    components: 'Komponente',
    tutorials: 'Vodiči',
    examples: 'Primjeri',
    skills: 'Vještine',
    help: 'Pomoć',
    about: 'O projektu',
    github: 'GitHub'
  },
  footer: {
    license: 'Besplatan softver otvorenog koda — BSD, MIT, Apache-2.0, GPL-2.0 ili GPL-3.0.',
    trademark: 'Lily™ i Lily Design System™ su zaštitni znakovi.',
    why: 'Zašto Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Jezik',
    textSize: 'Veličina teksta',
    share: 'Podijeli',
    link: 'Mjesta',
    search: 'Traži',
    searchInput: 'Pojmovi za pretraživanje',
    searchSubmit: 'Traži'
  },
  home: {
    heroTitle: 'Dizajnirajte bolje za web.',
    heroTagline: 'Lily je besplatan, pristupačan dizajnerski sustav otvorenog koda sa stotinama komponenti za sedam okvira.',
    frameworks: 'Podržani okviri',
    tutorials: { heading: 'Vodiči', description: 'Naučite Lily korak po korak, u okviru koji koristite.' },
    components: { heading: 'Komponente', description: 'Stotine višekratno upotrebljivih, pristupačnih komponenti, svaka dokumentirana i prikazana.' },
    examples: { heading: 'Primjeri', description: 'Sedam potpunih, stiliziranih referentnih aplikacija koje možete klonirati i prilagoditi.' }
  }
};

const lt: UiStrings = {
  skipLink: 'Pereiti prie pagrindinio turinio',
  brandAriaLabel: 'Lily Design System pradžia',
  nav: {
    home: 'Pradžia',
    components: 'Komponentai',
    tutorials: 'Vadovėliai',
    examples: 'Pavyzdžiai',
    skills: 'Įgūdžiai',
    help: 'Pagalba',
    about: 'Apie',
    github: 'GitHub'
  },
  footer: {
    license: 'Nemokama atvirojo kodo programinė įranga — BSD, MIT, Apache-2.0, GPL-2.0 arba GPL-3.0.',
    trademark: 'Lily™ ir Lily Design System™ yra prekių ženklai.',
    why: 'Kodėl Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Kalba',
    textSize: 'Teksto dydis',
    share: 'Bendrinti',
    link: 'Vietos',
    search: 'Ieškoti',
    searchInput: 'Paieškos žodžiai',
    searchSubmit: 'Ieškoti'
  },
  home: {
    heroTitle: 'Kurkite geresnį žiniatinklį.',
    heroTagline: 'Lily yra nemokama, prieinama atvirojo kodo dizaino sistema su šimtais komponentų septyniems karkasams.',
    frameworks: 'Palaikomi karkasai',
    tutorials: { heading: 'Vadovėliai', description: 'Mokykitės Lily žingsnis po žingsnio savo naudojamame karkase.' },
    components: { heading: 'Komponentai', description: 'Šimtai pakartotinai naudojamų, prieinamų komponentų, kiekvienas dokumentuotas ir parodytas.' },
    examples: { heading: 'Pavyzdžiai', description: 'Septynios išsamios, apipavidalintos pavyzdinės programos, kurias galite klonuoti ir pritaikyti.' }
  }
};

const sl: UiStrings = {
  skipLink: 'Preskoči na glavno vsebino',
  brandAriaLabel: 'Domača stran Lily Design System',
  nav: {
    home: 'Domov',
    components: 'Komponente',
    tutorials: 'Vodniki',
    examples: 'Primeri',
    skills: 'Veščine',
    help: 'Pomoč',
    about: 'O projektu',
    github: 'GitHub'
  },
  footer: {
    license: 'Brezplačna odprtokodna programska oprema — BSD, MIT, Apache-2.0, GPL-2.0 ali GPL-3.0.',
    trademark: 'Lily™ in Lily Design System™ sta blagovni znamki.',
    why: 'Zakaj Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Jezik',
    textSize: 'Velikost besedila',
    share: 'Deli',
    link: 'Mesta',
    search: 'Išči',
    searchInput: 'Iskalni izrazi',
    searchSubmit: 'Išči'
  },
  home: {
    heroTitle: 'Oblikujte boljša spletna mesta.',
    heroTagline: 'Lily je brezplačen, dostopen odprtokodni oblikovalski sistem s stotinami komponent za sedem ogrodij.',
    frameworks: 'Podprta ogrodja',
    tutorials: { heading: 'Vodniki', description: 'Spoznajte Lily korak za korakom v ogrodju, ki ga uporabljate.' },
    components: { heading: 'Komponente', description: 'Na stotine večkrat uporabnih, dostopnih komponent, vsaka dokumentirana in prikazana.' },
    examples: { heading: 'Primeri', description: 'Sedem popolnih, oblikovanih referenčnih aplikacij, ki jih lahko klonirate in prilagodite.' }
  }
};

const lv: UiStrings = {
  skipLink: 'Pāriet uz galveno saturu',
  brandAriaLabel: 'Lily Design System sākumlapa',
  nav: {
    home: 'Sākums',
    components: 'Komponenti',
    tutorials: 'Pamācības',
    examples: 'Piemēri',
    skills: 'Prasmes',
    help: 'Palīdzība',
    about: 'Par',
    github: 'GitHub'
  },
  footer: {
    license: 'Bezmaksas atvērtā koda programmatūra — BSD, MIT, Apache-2.0, GPL-2.0 vai GPL-3.0.',
    trademark: 'Lily™ un Lily Design System™ ir preču zīmes.',
    why: 'Kāpēc Lily'
  },
  pickerLabels: {
    theme: 'Motīvs',
    locale: 'Valoda',
    textSize: 'Teksta izmērs',
    share: 'Kopīgot',
    link: 'Vietas',
    search: 'Meklēt',
    searchInput: 'Meklēšanas vārdi',
    searchSubmit: 'Meklēt'
  },
  home: {
    heroTitle: 'Veidojiet labāku tīmekli.',
    heroTagline: 'Lily ir bezmaksas, pieejama atvērtā koda dizaina sistēma ar simtiem komponentu septiņiem ietvariem.',
    frameworks: 'Atbalstītie ietvari',
    tutorials: { heading: 'Pamācības', description: 'Apgūstiet Lily soli pa solim savā izmantotajā ietvarā.' },
    components: { heading: 'Komponenti', description: 'Simtiem atkārtoti izmantojamu, pieejamu komponentu, katrs dokumentēts un demonstrēts.' },
    examples: { heading: 'Piemēri', description: 'Septiņas pilnīgas, noformētas atsauces lietotnes, ko varat klonēt un pielāgot.' }
  }
};

const mt: UiStrings = {
  skipLink: 'Aqbeż għall-kontenut ewlieni',
  brandAriaLabel: 'Paġna ewlenija ta’ Lily Design System',
  nav: {
    home: 'Dar',
    components: 'Komponenti',
    tutorials: 'Tutorjals',
    examples: 'Eżempji',
    skills: 'Ħiliet',
    help: 'Għajnuna',
    about: 'Dwar',
    github: 'GitHub'
  },
  footer: {
    license: 'Softwer ħieles b’sors miftuħ — BSD, MIT, Apache-2.0, GPL-2.0 jew GPL-3.0.',
    trademark: 'Lily™ u Lily Design System™ huma trademarks.',
    why: 'Għaliex Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Lingwa',
    textSize: 'Daqs tat-test',
    share: 'Aqsam',
    link: 'Postijiet',
    search: 'Fittex',
    searchInput: 'Termini tat-tfittxija',
    searchSubmit: 'Fittex'
  },
  home: {
    heroTitle: 'Iddisinja aħjar għall-web.',
    heroTagline: 'Lily hija sistema tad-disinn b’xejn, aċċessibbli u b’sors miftuħ, b’mijiet ta’ komponenti għal seba’ framework.',
    frameworks: 'Frameworks appoġġjati',
    tutorials: { heading: 'Tutorjals', description: 'Tgħallem Lily pass pass, fil-framework li tuża.' },
    components: { heading: 'Komponenti', description: 'Mijiet ta’ komponenti riutilizzabbli u aċċessibbli, kull wieħed iddokumentat u murija.' },
    examples: { heading: 'Eżempji', description: 'Seba’ applikazzjonijiet ta’ referenza sħaħ u stilizzati li tista’ tikkloni u taġġusta.' }
  }
};

const ga: UiStrings = {
  skipLink: 'Léim chuig an bpríomhábhar',
  brandAriaLabel: 'Leathanach baile Lily Design System',
  nav: {
    home: 'Baile',
    components: 'Comhpháirteanna',
    tutorials: 'Teagasc',
    examples: 'Samplaí',
    skills: 'Scileanna',
    help: 'Cabhair',
    about: 'Maidir leis',
    github: 'GitHub'
  },
  footer: {
    license: 'Bogearraí foinse oscailte saor in aisce — BSD, MIT, Apache-2.0, GPL-2.0 nó GPL-3.0.',
    trademark: 'Is trádmharcanna iad Lily™ agus Lily Design System™.',
    why: 'Cén fáth Lily'
  },
  pickerLabels: {
    theme: 'Téama',
    locale: 'Teanga',
    textSize: 'Méid an téacs',
    share: 'Roinn',
    link: 'Áiteanna',
    search: 'Cuardaigh',
    searchInput: 'Téarmaí cuardaigh',
    searchSubmit: 'Cuardaigh'
  },
  home: {
    heroTitle: 'Dear don ghréasán níos fearr.',
    heroTagline: 'Is córas dearaidh saor in aisce, inrochtana, foinse oscailte é Lily, le céadta comhpháirteanna do sheacht gcreat.',
    frameworks: 'Creataí tacaithe',
    tutorials: { heading: 'Teagasc', description: 'Foghlaim Lily céim ar chéim, sa chreat a úsáideann tú.' },
    components: { heading: 'Comhpháirteanna', description: 'Céadta comhpháirteanna inúsáidte arís agus inrochtana, gach ceann doiciméadaithe agus léirithe.' },
    examples: { heading: 'Samplaí', description: 'Seacht n-iarratas tagartha iomlán, stíleáilte, ar féidir leat a chlónáil agus a choigeartú.' }
  }
};

const lb: UiStrings = {
  skipLink: 'Direkt zum Haaptinhalt',
  brandAriaLabel: 'Startsäit vu Lily Design System',
  nav: {
    home: 'Start',
    components: 'Komponenten',
    tutorials: 'Tutorialen',
    examples: 'Beispiller',
    skills: 'Fäegkeeten',
    help: 'Hëllef',
    about: 'Iwwer',
    github: 'GitHub'
  },
  footer: {
    license: 'Gratis Open-Source-Software — BSD, MIT, Apache-2.0, GPL-2.0 oder GPL-3.0.',
    trademark: 'Lily™ a Lily Design System™ si Mark.',
    why: 'Firwat Lily'
  },
  pickerLabels: {
    theme: 'Thema',
    locale: 'Sprooch',
    textSize: 'Textgréisst',
    share: 'Deelen',
    link: 'Plazen',
    search: 'Sichen',
    searchInput: 'Sichbegrëffer',
    searchSubmit: 'Sichen'
  },
  home: {
    heroTitle: 'Besser Webdesign maachen.',
    heroTagline: 'Lily ass en gratis, zougänglecht Open-Source-Designsystem mat Honnerte vu Komponenten fir siwen Frameworks.',
    frameworks: 'Ënnerstëtzte Frameworks',
    tutorials: { heading: 'Tutorialen', description: 'Léiert Lily Schrëtt fir Schrëtt, am Framework dat Dir benotzt.' },
    components: { heading: 'Komponenten', description: 'Honnerte vu wiederverwendbare, zougängleche Komponenten, jidderee dokumentéiert a gewisen.' },
    examples: { heading: 'Beispiller', description: 'Siwen komplett, gestalte Referenzapplikatiounen, déi Dir klonen an upasse kënnt.' }
  }
};

const pa: UiStrings = {
  skipLink: 'ਮੁੱਖ ਸਮੱਗਰੀ ਤੇ ਜਾਓ',
  brandAriaLabel: 'Lily Design System ਮੁੱਖ ਪੰਨਾ',
  nav: {
    home: 'ਮੁੱਖ ਪੰਨਾ',
    components: 'ਕੰਪੋਨੈਂਟ',
    tutorials: 'ਟਿਊਟੋਰਿਅਲ',
    examples: 'ਉਦਾਹਰਨਾਂ',
    skills: 'ਹੁਨਰ',
    help: 'ਮਦਦ',
    about: 'ਬਾਰੇ',
    github: 'GitHub'
  },
  footer: {
    license: 'ਮੁਫ਼ਤ ਓਪਨ ਸੋਰਸ — BSD, MIT, Apache-2.0, GPL-2.0, ਜਾਂ GPL-3.0।',
    trademark: 'Lily™ ਅਤੇ Lily Design System™ ਟ੍ਰੇਡਮਾਰਕ ਹਨ।',
    why: 'Lily ਕਿਉਂ'
  },
  pickerLabels: {
    theme: 'ਥੀਮ',
    locale: 'ਭਾਸ਼ਾ',
    textSize: 'ਲਿਖਤ ਦਾ ਆਕਾਰ',
    share: 'ਸਾਂਝਾ ਕਰੋ',
    link: 'ਥਾਵਾਂ',
    search: 'ਖੋਜੋ',
    searchInput: 'ਖੋਜ ਸ਼ਬਦ',
    searchSubmit: 'ਖੋਜੋ'
  },
  home: {
    heroTitle: 'ਵੈੱਬ ਲਈ ਬਿਹਤਰ ਡਿਜ਼ਾਈਨ ਕਰੋ।',
    heroTagline: 'Lily ਇੱਕ ਮੁਫ਼ਤ, ਓਪਨ-ਸੋਰਸ, ਪਹੁੰਚਯੋਗ ਡਿਜ਼ਾਈਨ ਸਿਸਟਮ ਹੈ, ਜਿਸ ਵਿੱਚ ਸੱਤ ਫ੍ਰੇਮਵਰਕਾਂ ਲਈ ਸੈਂਕੜੇ ਕੰਪੋਨੈਂਟ ਹਨ।',
    frameworks: 'ਸਮਰਥਿਤ ਫ੍ਰੇਮਵਰਕ',
    tutorials: { heading: 'ਟਿਊਟੋਰਿਅਲ', description: 'ਜਿਹੜਾ ਫ੍ਰੇਮਵਰਕ ਤੁਸੀਂ ਵਰਤਦੇ ਹੋ, ਉਸ ਵਿੱਚ Lily ਨੂੰ ਕਦਮ-ਦਰ-ਕਦਮ ਸਿੱਖੋ।' },
    components: { heading: 'ਕੰਪੋਨੈਂਟ', description: 'ਸੈਂਕੜੇ ਮੁੜ-ਵਰਤੋਂ ਯੋਗ, ਪਹੁੰਚਯੋਗ ਕੰਪੋਨੈਂਟ, ਹਰੇਕ ਦੇ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਡੈਮੋ ਸਮੇਤ।' },
    examples: { heading: 'ਉਦਾਹਰਨਾਂ', description: 'ਸੱਤ ਪੂਰੀਆਂ, ਸਟਾਈਲ ਕੀਤੀਆਂ ਹਵਾਲਾ ਐਪਲੀਕੇਸ਼ਨਾਂ ਜਿਨ੍ਹਾਂ ਨੂੰ ਤੁਸੀਂ ਕਲੋਨ ਕਰਕੇ ਬਦਲ ਸਕਦੇ ਹੋ।' }
  }
};

const mr: UiStrings = {
  skipLink: 'मुख्य मजकुराकडे जा',
  brandAriaLabel: 'Lily Design System मुख्यपृष्ठ',
  nav: {
    home: 'मुख्यपृष्ठ',
    components: 'घटक',
    tutorials: 'ट्यूटोरियल',
    examples: 'उदाहरणे',
    skills: 'कौशल्ये',
    help: 'मदत',
    about: 'माहिती',
    github: 'GitHub'
  },
  footer: {
    license: 'मोफत ओपन-सोर्स — BSD, MIT, Apache-2.0, GPL-2.0, किंवा GPL-3.0.',
    trademark: 'Lily™ आणि Lily Design System™ ही ट्रेडमार्क आहेत.',
    why: 'Lily का'
  },
  pickerLabels: {
    theme: 'थीम',
    locale: 'भाषा',
    textSize: 'मजकुराचा आकार',
    share: 'शेअर करा',
    link: 'ठिकाणे',
    search: 'शोधा',
    searchInput: 'शोध शब्द',
    searchSubmit: 'शोधा'
  },
  home: {
    heroTitle: 'वेबसाठी अधिक चांगले डिझाइन करा.',
    heroTagline: 'Lily ही मोफत, ओपन-सोर्स, सुलभ डिझाइन प्रणाली आहे, ज्यात सात फ्रेमवर्कसाठी शेकडो घटक आहेत.',
    frameworks: 'समर्थित फ्रेमवर्क',
    tutorials: { heading: 'ट्यूटोरियल', description: 'तुम्ही वापरत असलेल्या फ्रेमवर्कमध्ये Lily टप्प्याटप्प्याने शिका.' },
    components: { heading: 'घटक', description: 'शेकडो पुन्हा वापरता येणारे, सुलभ घटक, प्रत्येकाचे दस्तऐवजीकरण आणि प्रात्यक्षिक.' },
    examples: { heading: 'उदाहरणे', description: 'सात पूर्ण, शैलीबद्ध संदर्भ अनुप्रयोग जे तुम्ही क्लोन करून बदलू शकता.' }
  }
};

const te: UiStrings = {
  skipLink: 'ప్రధాన కంటెంట్‌కు వెళ్లండి',
  brandAriaLabel: 'Lily Design System హోమ్',
  nav: {
    home: 'హోమ్',
    components: 'భాగాలు',
    tutorials: 'ట్యుటోరియల్స్',
    examples: 'ఉదాహరణలు',
    skills: 'నైపుణ్యాలు',
    help: 'సహాయం',
    about: 'గురించి',
    github: 'GitHub'
  },
  footer: {
    license: 'ఉచిత ఓపెన్ సోర్స్ — BSD, MIT, Apache-2.0, GPL-2.0, లేదా GPL-3.0.',
    trademark: 'Lily™ మరియు Lily Design System™ ట్రేడ్‌మార్క్‌లు.',
    why: 'Lily ఎందుకు'
  },
  pickerLabels: {
    theme: 'థీమ్',
    locale: 'భాష',
    textSize: 'టెక్స్ట్ పరిమాణం',
    share: 'షేర్ చేయండి',
    link: 'స్థలాలు',
    search: 'వెతకండి',
    searchInput: 'వెతుకు పదాలు',
    searchSubmit: 'వెతకండి'
  },
  home: {
    heroTitle: 'వెబ్ కోసం మెరుగ్గా డిజైన్ చేయండి.',
    heroTagline: 'Lily అనేది ఏడు ఫ్రేమ్‌వర్క్‌ల కోసం వందలాది భాగాలతో కూడిన ఉచిత, ఓపెన్ సోర్స్, అందుబాటులో ఉండే డిజైన్ సిస్టమ్.',
    frameworks: 'మద్దతు ఉన్న ఫ్రేమ్‌వర్క్‌లు',
    tutorials: { heading: 'ట్యుటోరియల్స్', description: 'మీరు ఉపయోగించే ఫ్రేమ్‌వర్క్‌లో Lily ని దశలవారీగా నేర్చుకోండి.' },
    components: { heading: 'భాగాలు', description: 'వందలాది పునర్వినియోగ, అందుబాటులో ఉండే భాగాలు, ప్రతిదానికీ డాక్యుమెంటేషన్ మరియు డెమో ఉన్నాయి.' },
    examples: { heading: 'ఉదాహరణలు', description: 'మీరు క్లోన్ చేసి మార్చుకోగల ఏడు పూర్తి, స్టైల్ చేసిన రిఫరెన్స్ అప్లికేషన్‌లు.' }
  }
};

const ha: UiStrings = {
  skipLink: 'Tsallaka zuwa babban abun ciki',
  brandAriaLabel: 'Shafin farko na Lily Design System',
  nav: {
    home: 'Gida',
    components: 'Abubuwan haɗawa',
    tutorials: 'Darussa',
    examples: 'Misalai',
    skills: 'Ƙwarewa',
    help: 'Taimako',
    about: 'Game da',
    github: 'GitHub'
  },
  footer: {
    license: 'Manhaja ta kyauta mai buɗaɗɗen tushe — BSD, MIT, Apache-2.0, GPL-2.0 ko GPL-3.0.',
    trademark: 'Lily™ da Lily Design System™ alamomin kasuwanci ne.',
    why: 'Me ya sa Lily'
  },
  pickerLabels: {
    theme: 'Jigo',
    locale: 'Harshe',
    textSize: 'Girman rubutu',
    share: 'Raba',
    link: 'Wurare',
    search: 'Bincika',
    searchInput: 'Kalmomin bincike',
    searchSubmit: 'Bincika'
  },
  home: {
    heroTitle: 'Ƙera ƙirar yanar gizo da kyau.',
    heroTagline: 'Lily tsarin ƙira ne na kyauta, mai buɗaɗɗen tushe, kuma mai sauƙin isa, mai ɗauke da ɗaruruwan abubuwan haɗawa don tsare-tsare bakwai.',
    frameworks: 'Tsare-tsaren da ake tallafawa',
    tutorials: { heading: 'Darussa', description: 'Koyi Lily mataki-mataki, a tsarin da kake amfani da shi.' },
    components: { heading: 'Abubuwan haɗawa', description: 'Ɗaruruwan abubuwan haɗawa masu sake amfani da su kuma masu sauƙin isa, kowanne yana da bayani da nuni.' },
    examples: { heading: 'Misalai', description: 'Aikace-aikacen misali bakwai cikakku, masu ado, waɗanda za ka iya kwafa ka gyara.' }
  }
};

const ta: UiStrings = {
  skipLink: 'முதன்மை உள்ளடக்கத்திற்குச் செல்',
  brandAriaLabel: 'Lily Design System முகப்பு',
  nav: {
    home: 'முகப்பு',
    components: 'கூறுகள்',
    tutorials: 'பயிற்சிகள்',
    examples: 'எடுத்துக்காட்டுகள்',
    skills: 'திறன்கள்',
    help: 'உதவி',
    about: 'பற்றி',
    github: 'GitHub'
  },
  footer: {
    license: 'இலவச திறந்த மூல மென்பொருள் — BSD, MIT, Apache-2.0, GPL-2.0 அல்லது GPL-3.0.',
    trademark: 'Lily™ மற்றும் Lily Design System™ வர்த்தக முத்திரைகள்.',
    why: 'ஏன் Lily'
  },
  pickerLabels: {
    theme: 'தீம்',
    locale: 'மொழி',
    textSize: 'உரை அளவு',
    share: 'பகிர்',
    link: 'இடங்கள்',
    search: 'தேடு',
    searchInput: 'தேடல் சொற்கள்',
    searchSubmit: 'தேடு'
  },
  home: {
    heroTitle: 'இணையத்திற்கு சிறப்பாக வடிவமைக்கவும்.',
    heroTagline: 'Lily என்பது ஏழு கட்டமைப்புகளுக்கான நூற்றுக்கணக்கான கூறுகளுடன் கூடிய இலவச, திறந்த மூல, அணுகக்கூடிய வடிவமைப்பு அமைப்பு.',
    frameworks: 'ஆதரிக்கப்படும் கட்டமைப்புகள்',
    tutorials: { heading: 'பயிற்சிகள்', description: 'நீங்கள் பயன்படுத்தும் கட்டமைப்பில் Lily ஐ படிப்படியாகக் கற்றுக்கொள்ளுங்கள்.' },
    components: { heading: 'கூறுகள்', description: 'நூற்றுக்கணக்கான மறுபயன்பாட்டு, அணுகக்கூடிய கூறுகள், ஒவ்வொன்றுக்கும் ஆவணமும் செயல்விளக்கமும் உண்டு.' },
    examples: { heading: 'எடுத்துக்காட்டுகள்', description: 'நீங்கள் நகலெடுத்து மாற்றியமைக்கக்கூடிய ஏழு முழுமையான, பாணியிடப்பட்ட மேற்கோள் பயன்பாடுகள்.' }
  }
};

const fa: UiStrings = {
  skipLink: 'پرش به محتوای اصلی',
  brandAriaLabel: 'صفحهٔ اصلی Lily Design System',
  nav: {
    home: 'خانه',
    components: 'مؤلفه‌ها',
    tutorials: 'آموزش‌ها',
    examples: 'نمونه‌ها',
    skills: 'مهارت‌ها',
    help: 'راهنما',
    about: 'درباره',
    github: 'GitHub'
  },
  footer: {
    license: 'نرم‌افزار آزاد و متن‌باز — BSD، MIT، Apache-2.0، GPL-2.0 یا GPL-3.0.',
    trademark: 'Lily™ و Lily Design System™ علائم تجاری هستند.',
    why: 'چرا Lily'
  },
  pickerLabels: {
    theme: 'زمینه',
    locale: 'زبان',
    textSize: 'اندازهٔ متن',
    share: 'هم‌رسانی',
    link: 'مکان‌ها',
    search: 'جستجو',
    searchInput: 'عبارت‌های جستجو',
    searchSubmit: 'جستجو'
  },
  home: {
    heroTitle: 'وب را بهتر طراحی کنید.',
    heroTagline: 'Lily یک سیستم طراحی رایگان، متن‌باز و در دسترس است با صدها مؤلفه برای هفت چارچوب.',
    frameworks: 'چارچوب‌های پشتیبانی‌شده',
    tutorials: { heading: 'آموزش‌ها', description: 'Lily را گام‌به‌گام و در چارچوبی که استفاده می‌کنید یاد بگیرید.' },
    components: { heading: 'مؤلفه‌ها', description: 'صدها مؤلفهٔ قابل‌استفادهٔ مجدد و در دسترس، هر یک با مستندات و نمونهٔ نمایشی.' },
    examples: { heading: 'نمونه‌ها', description: 'هفت برنامهٔ مرجع کامل و سبک‌دار که می‌توانید همسان‌سازی و تنظیم کنید.' }
  }
};

const jv: UiStrings = {
  skipLink: 'Langsung menyang isi utama',
  brandAriaLabel: 'Kaca ngarep Lily Design System',
  nav: {
    home: 'Ngarep',
    components: 'Komponen',
    tutorials: 'Tutorial',
    examples: 'Conto',
    skills: 'Katrampilan',
    help: 'Pitulung',
    about: 'Babagan',
    github: 'GitHub'
  },
  footer: {
    license: 'Piranti lunak sumber terbuka gratis — BSD, MIT, Apache-2.0, GPL-2.0, utawa GPL-3.0.',
    trademark: 'Lily™ lan Lily Design System™ iku merek dagang.',
    why: 'Kenging punapa Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Basa',
    textSize: 'Ukuran teks',
    share: 'Bagekake',
    link: 'Panggonan',
    search: 'Golek',
    searchInput: 'Tembung panggolekan',
    searchSubmit: 'Golek'
  },
  home: {
    heroTitle: 'Rancang web luwih becik.',
    heroTagline: 'Lily iku sistem desain gratis, sumber terbuka, lan gampang diakses, kanthi atusan komponen kanggo pitung framework.',
    frameworks: 'Framework sing didhukung',
    tutorials: { heading: 'Tutorial', description: 'Sinau Lily sithik-sithik, ing framework sing sampeyan tumindakake.' },
    components: { heading: 'Komponen', description: 'Atusan komponen sing bisa dienggo maneh lan gampang diakses, saben siji ana dokumentasi lan demone.' },
    examples: { heading: 'Conto', description: 'Pitung aplikasi referensi lengkap sing wis ditata, sing bisa sampeyan klona lan sesuaikan.' }
  }
};

const gu: UiStrings = {
  skipLink: 'મુખ્ય સામગ્રી પર જાઓ',
  brandAriaLabel: 'Lily Design System હોમ',
  nav: {
    home: 'હોમ',
    components: 'ઘટકો',
    tutorials: 'ટ્યુટોરિયલ',
    examples: 'ઉદાહરણો',
    skills: 'કૌશલ્યો',
    help: 'મદદ',
    about: 'વિશે',
    github: 'GitHub'
  },
  footer: {
    license: 'મફત ઓપન-સોર્સ — BSD, MIT, Apache-2.0, GPL-2.0, અથવા GPL-3.0.',
    trademark: 'Lily™ અને Lily Design System™ ટ્રેડમાર્ક છે.',
    why: 'Lily શા માટે'
  },
  pickerLabels: {
    theme: 'થીમ',
    locale: 'ભાષા',
    textSize: 'લખાણનું કદ',
    share: 'શેર કરો',
    link: 'સ્થળો',
    search: 'શોધો',
    searchInput: 'શોધ શબ્દો',
    searchSubmit: 'શોધો'
  },
  home: {
    heroTitle: 'વેબ માટે વધુ સારી ડિઝાઇન કરો.',
    heroTagline: 'Lily એ સાત ફ્રેમવર્ક માટે સેંકડો ઘટકો ધરાવતી મફત, ઓપન-સોર્સ, સુલભ ડિઝાઇન સિસ્ટમ છે.',
    frameworks: 'સમર્થિત ફ્રેમવર્ક',
    tutorials: { heading: 'ટ્યુટોરિયલ', description: 'તમે વાપરો છો તે ફ્રેમવર્કમાં Lily ને પગલે પગલે શીખો.' },
    components: { heading: 'ઘટકો', description: 'સેંકડો ફરી વાપરી શકાય તેવા, સુલભ ઘટકો, દરેકના દસ્તાવેજ અને ડેમો સાથે.' },
    examples: { heading: 'ઉદાહરણો', description: 'સાત સંપૂર્ણ, શૈલીયુક્ત સંદર્ભ એપ્લિકેશનો જેને તમે ક્લોન કરીને ગોઠવી શકો છો.' }
  }
};

const bh: UiStrings = {
  skipLink: 'मुख्य सामग्री पर जाईं',
  brandAriaLabel: 'Lily Design System होम',
  nav: {
    home: 'होम',
    components: 'घटक',
    tutorials: 'ट्यूटोरियल',
    examples: 'उदाहरण',
    skills: 'हुनर',
    help: 'मदद',
    about: 'बारे में',
    github: 'GitHub'
  },
  footer: {
    license: 'मुफ्त ओपन-सोर्स — BSD, MIT, Apache-2.0, GPL-2.0, भा GPL-3.0।',
    trademark: 'Lily™ आ Lily Design System™ ट्रेडमार्क हवें।',
    why: 'Lily काहें'
  },
  pickerLabels: {
    theme: 'थीम',
    locale: 'भाषा',
    textSize: 'पाठ के आकार',
    share: 'साझा करीं',
    link: 'जगह',
    search: 'खोजीं',
    searchInput: 'खोज के शब्द',
    searchSubmit: 'खोजीं'
  },
  home: {
    heroTitle: 'वेब खातिर बढ़िया डिजाइन करीं।',
    heroTagline: 'Lily एगो मुफ्त, ओपन-सोर्स, सुलभ डिजाइन सिस्टम हs, जेमें सात फ्रेमवर्क खातिर सैकड़न घटक बाड़ें।',
    frameworks: 'समर्थित फ्रेमवर्क',
    tutorials: { heading: 'ट्यूटोरियल', description: 'जवन फ्रेमवर्क रउआ इस्तेमाल करीले, ओमें Lily के कदम-कदम से सीखीं।' },
    components: { heading: 'घटक', description: 'सैकड़न फेर से इस्तेमाल होखे वाला, सुलभ घटक, हर एक के दस्तावेज आ डेमो के साथे।' },
    examples: { heading: 'उदाहरण', description: 'सात पूरा, शैलीदार संदर्भ एप्लिकेशन जेकरा के रउआ क्लोन करके बदल सकीले।' }
  }
};

const gd: UiStrings = {
  skipLink: 'Leum chun na prìomh shusbaint',
  brandAriaLabel: 'Duilleag-dhachaigh Lily Design System',
  nav: {
    home: 'Dhachaigh',
    components: 'Co-phàirtean',
    tutorials: 'Oideachaidhean',
    examples: 'Eisimpleirean',
    skills: 'Sgilean',
    help: 'Cuideachadh',
    about: 'Mu dheidhinn',
    github: 'GitHub'
  },
  footer: {
    license: 'Bathar-bog fosgailte an-asgaidh — BSD, MIT, Apache-2.0, GPL-2.0 no GPL-3.0.',
    trademark: 'Tha Lily™ agus Lily Design System™ nan comharran-malairt.',
    why: 'Carson Lily'
  },
  pickerLabels: {
    theme: 'Ùrlar',
    locale: 'Cànan',
    textSize: 'Meud an teacsa',
    share: 'Co-roinn',
    link: 'Àiteachan',
    search: 'Lorg',
    searchInput: 'Briathran-luirg',
    searchSubmit: 'Lorg'
  },
  home: {
    heroTitle: 'Dèan dealbhadh-lìn nas fheàrr.',
    heroTagline: '’S e siostam dealbhaidh an-asgaidh, le tùs fosgailte agus so-ruigsinneach a th’ ann an Lily le ceudan de cho-phàirtean airson seachd frèamaichean.',
    frameworks: 'Frèamaichean le taic',
    tutorials: { heading: 'Oideachaidhean', description: 'Ionnsaich Lily ceum air cheum, ge bith dè am frèam a chleachdas tu.' },
    components: { heading: 'Co-phàirtean', description: 'Ceudan de cho-phàirtean so-ruigsinneach ath-chleachdadh, gach fear air a sgrìobhadh agus a shealltainn.' },
    examples: { heading: 'Eisimpleirean', description: 'Seachd tagraidhean iomlan le stoidhle ris an urrainn dhut lethbhreac a dhèanamh agus atharrachadh.' }
  }
};

const is: UiStrings = {
  skipLink: 'Fara beint í aðalefni',
  brandAriaLabel: 'Heimasíða Lily Design System',
  nav: {
    home: 'Heim',
    components: 'Íhlutir',
    tutorials: 'Kennsluefni',
    examples: 'Dæmi',
    skills: 'Færni',
    help: 'Hjálp',
    about: 'Um',
    github: 'GitHub'
  },
  footer: {
    license: 'Ókeypis opinn hugbúnaður — BSD, MIT, Apache-2.0, GPL-2.0 eða GPL-3.0.',
    trademark: 'Lily™ og Lily Design System™ eru vörumerki.',
    why: 'Af hverju Lily'
  },
  pickerLabels: {
    theme: 'Þema',
    locale: 'Tungumál',
    textSize: 'Textastærð',
    share: 'Deila',
    link: 'Staðir',
    search: 'Leita',
    searchInput: 'Leitarorð',
    searchSubmit: 'Leita'
  },
  home: {
    heroTitle: 'Hannaðu vefinn betur.',
    heroTagline: 'Lily er ókeypis, opið og aðgengilegt hönnunarkerfi með hundruðum íhluta fyrir sjö rammaforrit.',
    frameworks: 'Rammar sem eru studdir',
    tutorials: { heading: 'Kennsluefni', description: 'Lærðu Lily skref fyrir skref, í hvaða ramma sem þú notar.' },
    components: { heading: 'Íhlutir', description: 'Hundruð endurnýtanlegra og aðgengilegra íhluta, hver með skjölun og sýnidæmi.' },
    examples: { heading: 'Dæmi', description: 'Sjö heil, stíluð viðmiðunarforrit sem þú getur afritað og aðlagað.' }
  }
};

const eu: UiStrings = {
  skipLink: 'Joan eduki nagusira',
  brandAriaLabel: 'Lily Design System hasierako orria',
  nav: {
    home: 'Hasiera',
    components: 'Osagaiak',
    tutorials: 'Tutorialak',
    examples: 'Adibideak',
    skills: 'Trebetasunak',
    help: 'Laguntza',
    about: 'Honi buruz',
    github: 'GitHub'
  },
  footer: {
    license: 'Kode irekiko software librea — BSD, MIT, Apache-2.0, GPL-2.0 edo GPL-3.0.',
    trademark: 'Lily™ eta Lily Design System™ marka erregistratuak dira.',
    why: 'Zergatik Lily'
  },
  pickerLabels: {
    theme: 'Gaia',
    locale: 'Hizkuntza',
    textSize: 'Testuaren tamaina',
    share: 'Partekatu',
    link: 'Lekuak',
    search: 'Bilatu',
    searchInput: 'Bilaketa-terminoak',
    searchSubmit: 'Bilatu'
  },
  home: {
    heroTitle: 'Diseinatu weba hobeto.',
    heroTagline: 'Lily diseinu-sistema librea, irekia eta irisgarria da, ehunka osagai dituena zazpi framework-erako.',
    frameworks: 'Onartutako framework-ak',
    tutorials: { heading: 'Tutorialak', description: 'Ikasi Lily pausoz pauso, erabiltzen duzun framework-ean.' },
    components: { heading: 'Osagaiak', description: 'Ehunka osagai berrerabilgarri eta irisgarri, bakoitza dokumentatuta eta erakusketarekin.' },
    examples: { heading: 'Adibideak', description: 'Zazpi erreferentziazko aplikazio oso eta estilatu, klonatu eta egokitu ditzakezunak.' }
  }
};

const uk: UiStrings = {
  skipLink: 'Перейти до основного вмісту',
  brandAriaLabel: 'Головна сторінка Lily Design System',
  nav: {
    home: 'Головна',
    components: 'Компоненти',
    tutorials: 'Посібники',
    examples: 'Приклади',
    skills: 'Навички',
    help: 'Допомога',
    about: 'Про проєкт',
    github: 'GitHub'
  },
  footer: {
    license: 'Безкоштовне програмне забезпечення з відкритим кодом — BSD, MIT, Apache-2.0, GPL-2.0 або GPL-3.0.',
    trademark: 'Lily™ та Lily Design System™ є торговельними марками.',
    why: 'Чому Lily'
  },
  pickerLabels: {
    theme: 'Тема',
    locale: 'Мова',
    textSize: 'Розмір тексту',
    share: 'Поділитися',
    link: 'Розділи',
    search: 'Пошук',
    searchInput: 'Пошуковий запит',
    searchSubmit: 'Шукати'
  },
  home: {
    heroTitle: 'Створюйте вебдизайн краще.',
    heroTagline: 'Lily — безкоштовна, відкрита та доступна дизайн-система з сотнями компонентів для семи фреймворків.',
    frameworks: 'Підтримувані фреймворки',
    tutorials: { heading: 'Посібники', description: 'Вивчайте Lily крок за кроком у будь-якому фреймворку, яким ви користуєтеся.' },
    components: { heading: 'Компоненти', description: 'Сотні багаторазових доступних компонентів, кожен із документацією та демонстрацією.' },
    examples: { heading: 'Приклади', description: 'Сім повних стилізованих еталонних застосунків, які можна клонувати та змінювати.' }
  }
};

const ms: UiStrings = {
  skipLink: 'Langkau ke kandungan utama',
  brandAriaLabel: 'Laman utama Lily Design System',
  nav: {
    home: 'Utama',
    components: 'Komponen',
    tutorials: 'Tutorial',
    examples: 'Contoh',
    skills: 'Kemahiran',
    help: 'Bantuan',
    about: 'Perihal',
    github: 'GitHub'
  },
  footer: {
    license: 'Perisian sumber terbuka percuma — BSD, MIT, Apache-2.0, GPL-2.0 atau GPL-3.0.',
    trademark: 'Lily™ dan Lily Design System™ ialah tanda dagangan.',
    why: 'Mengapa Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Bahasa',
    textSize: 'Saiz teks',
    share: 'Kongsi',
    link: 'Tempat',
    search: 'Cari',
    searchInput: 'Kata carian',
    searchSubmit: 'Cari'
  },
  home: {
    heroTitle: 'Bina reka bentuk web dengan lebih baik.',
    heroTagline: 'Lily ialah sistem reka bentuk percuma, sumber terbuka dan mudah diakses dengan beratus-ratus komponen untuk tujuh rangka kerja.',
    frameworks: 'Rangka kerja yang disokong',
    tutorials: { heading: 'Tutorial', description: 'Pelajari Lily langkah demi langkah, dalam rangka kerja apa pun yang anda gunakan.' },
    components: { heading: 'Komponen', description: 'Beratus-ratus komponen yang boleh digunakan semula dan mudah diakses, masing-masing didokumenkan dan didemonstrasikan.' },
    examples: { heading: 'Contoh', description: 'Tujuh aplikasi rujukan lengkap yang digayakan, boleh anda klon dan ubah suai.' }
  }
};

const he: UiStrings = {
  skipLink: 'דלג לתוכן הראשי',
  brandAriaLabel: 'דף הבית של Lily Design System',
  nav: {
    home: 'בית',
    components: 'רכיבים',
    tutorials: 'מדריכים',
    examples: 'דוגמאות',
    skills: 'מיומנויות',
    help: 'עזרה',
    about: 'אודות',
    github: 'GitHub'
  },
  footer: {
    license: 'תוכנה חופשית בקוד פתוח — BSD, MIT, Apache-2.0, GPL-2.0 או GPL-3.0.',
    trademark: 'Lily™ ו-Lily Design System™ הם סימנים מסחריים.',
    why: 'למה Lily'
  },
  pickerLabels: {
    theme: 'ערכת נושא',
    locale: 'שפה',
    textSize: 'גודל טקסט',
    share: 'שיתוף',
    link: 'מקומות',
    search: 'חיפוש',
    searchInput: 'מילות חיפוש',
    searchSubmit: 'חפש'
  },
  home: {
    heroTitle: 'בנו עיצובי אינטרנט טוב יותר.',
    heroTagline: 'Lily היא מערכת עיצוב חופשית, בקוד פתוח ונגישה, עם מאות רכיבים לשבע מסגרות עבודה.',
    frameworks: 'מסגרות נתמכות',
    tutorials: { heading: 'מדריכים', description: 'למדו את Lily צעד אחר צעד, בכל מסגרת שבה אתם משתמשים.' },
    components: { heading: 'רכיבים', description: 'מאות רכיבים לשימוש חוזר ונגישים, כל אחד מתועד ומודגם.' },
    examples: { heading: 'דוגמאות', description: 'שבע אפליקציות ייחוס מלאות ומעוצבות שאפשר לשכפל ולהתאים.' }
  }
};

const pcm: UiStrings = {
  skipLink: 'Skip go di main content',
  brandAriaLabel: 'Lily Design System home',
  nav: {
    home: 'Home',
    components: 'Components',
    tutorials: 'Tutorials',
    examples: 'Examples',
    skills: 'Skills',
    help: 'Help',
    about: 'About',
    github: 'GitHub'
  },
  footer: {
    license: 'Free open source software — BSD, MIT, Apache-2.0, GPL-2.0 or GPL-3.0.',
    trademark: 'Lily™ and Lily Design System™ na trademarks.',
    why: 'Why Lily'
  },
  pickerLabels: {
    theme: 'Theme',
    locale: 'Language',
    textSize: 'Text size',
    share: 'Share',
    link: 'Places',
    search: 'Search',
    searchInput: 'Wetin you dey find',
    searchSubmit: 'Search'
  },
  home: {
    heroTitle: 'Build web design well well.',
    heroTagline: 'Lily na free, open-source, accessible design system wey get hundreds of components for nine frameworks.',
    frameworks: 'Frameworks wey we support',
    tutorials: { heading: 'Tutorials', description: 'Learn Lily step by step, for any framework wey you dey use.' },
    components: { heading: 'Components', description: 'Hundreds of components wey you fit use again and again, wey everybody fit use, each one get documentation and demo.' },
    examples: { heading: 'Examples', description: 'Seven complete, styled reference apps wey you fit clone and change.' }
  }
};

const yue: UiStrings = {
  skipLink: '跳去主要內容',
  brandAriaLabel: 'Lily Design System 主頁',
  nav: {
    home: '主頁',
    components: '元件',
    tutorials: '教學',
    examples: '範例',
    skills: '技能',
    help: '幫助',
    about: '關於',
    github: 'GitHub'
  },
  footer: {
    license: '免費開源軟件 — BSD、MIT、Apache-2.0、GPL-2.0 或 GPL-3.0。',
    trademark: 'Lily™ 同 Lily Design System™ 係商標。',
    why: '點解揀 Lily'
  },
  pickerLabels: {
    theme: '主題',
    locale: '語言',
    textSize: '文字大細',
    share: '分享',
    link: '地方',
    search: '搜尋',
    searchInput: '搜尋字詞',
    searchSubmit: '搜尋'
  },
  home: {
    heroTitle: '令網頁設計做得更好。',
    heroTagline: 'Lily 係一套免費、開源、無障礙嘅設計系統,有幾百個元件,支援七個框架。',
    frameworks: '支援嘅框架',
    tutorials: { heading: '教學', description: '一步一步學 Lily,你用邊個框架都得。' },
    components: { heading: '元件', description: '幾百個可以重用又無障礙嘅元件,每個都有文件同示範。' },
    examples: { heading: '範例', description: '七個完整、有樣式嘅參考應用程式,可以複製返嚟改。' }
  }
};

const tl: UiStrings = {
  skipLink: 'Lumaktaw sa pangunahing nilalaman',
  brandAriaLabel: 'Home ng Lily Design System',
  nav: {
    home: 'Home',
    components: 'Mga Component',
    tutorials: 'Mga Tutorial',
    examples: 'Mga Halimbawa',
    skills: 'Mga Kasanayan',
    help: 'Tulong',
    about: 'Tungkol',
    github: 'GitHub'
  },
  footer: {
    license: 'Libreng open source na software — BSD, MIT, Apache-2.0, GPL-2.0 o GPL-3.0.',
    trademark: 'Ang Lily™ at Lily Design System™ ay mga trademark.',
    why: 'Bakit Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Wika',
    textSize: 'Laki ng teksto',
    share: 'Ibahagi',
    link: 'Mga lugar',
    search: 'Maghanap',
    searchInput: 'Mga salitang hahanapin',
    searchSubmit: 'Maghanap'
  },
  home: {
    heroTitle: 'Gawing mas mahusay ang disenyo ng web.',
    heroTagline: 'Ang Lily ay libre, open-source, at naa-access na design system na may daan-daang component para sa pitong framework.',
    frameworks: 'Mga sinusuportahang framework',
    tutorials: { heading: 'Mga Tutorial', description: 'Matutunan ang Lily nang paunti-unti, sa anumang framework na ginagamit mo.' },
    components: { heading: 'Mga Component', description: 'Daan-daang magagamit muli at naa-access na component, bawat isa ay may dokumentasyon at demo.' },
    examples: { heading: 'Mga Halimbawa', description: 'Pitong kumpleto at may istilong reference na application na maaari mong i-clone at baguhin.' }
  }
};

const kn: UiStrings = {
  skipLink: 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
  brandAriaLabel: 'Lily Design System ಮುಖಪುಟ',
  nav: {
    home: 'ಮುಖಪುಟ',
    components: 'ಘಟಕಗಳು',
    tutorials: 'ಟ್ಯುಟೋರಿಯಲ್‌ಗಳು',
    examples: 'ಉದಾಹರಣೆಗಳು',
    skills: 'ಕೌಶಲ್ಯಗಳು',
    help: 'ಸಹಾಯ',
    about: 'ಕುರಿತು',
    github: 'GitHub'
  },
  footer: {
    license: 'ಉಚಿತ ಮುಕ್ತ ಮೂಲ ತಂತ್ರಾಂಶ — BSD, MIT, Apache-2.0, GPL-2.0 ಅಥವಾ GPL-3.0.',
    trademark: 'Lily™ ಮತ್ತು Lily Design System™ ಟ್ರೇಡ್‌ಮಾರ್ಕ್‌ಗಳು.',
    why: 'ಏಕೆ Lily'
  },
  pickerLabels: {
    theme: 'ಥೀಮ್',
    locale: 'ಭಾಷೆ',
    textSize: 'ಪಠ್ಯದ ಗಾತ್ರ',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    link: 'ಸ್ಥಳಗಳು',
    search: 'ಹುಡುಕಿ',
    searchInput: 'ಹುಡುಕಾಟ ಪದಗಳು',
    searchSubmit: 'ಹುಡುಕಿ'
  },
  home: {
    heroTitle: 'ವೆಬ್ ವಿನ್ಯಾಸವನ್ನು ಉತ್ತಮವಾಗಿ ರೂಪಿಸಿ.',
    heroTagline: 'Lily ಏಳು ಫ್ರೇಮ್‌ವರ್ಕ್‌ಗಳಿಗೆ ನೂರಾರು ಘಟಕಗಳನ್ನು ಹೊಂದಿರುವ ಉಚಿತ, ಮುಕ್ತ ಮೂಲ, ಪ್ರವೇಶಿಸಬಹುದಾದ ವಿನ್ಯಾಸ ವ್ಯವಸ್ಥೆ.',
    frameworks: 'ಬೆಂಬಲಿತ ಫ್ರೇಮ್‌ವರ್ಕ್‌ಗಳು',
    tutorials: { heading: 'ಟ್ಯುಟೋರಿಯಲ್‌ಗಳು', description: 'ನೀವು ಬಳಸುವ ಯಾವುದೇ ಫ್ರೇಮ್‌ವರ್ಕ್‌ನಲ್ಲಿ Lily ಅನ್ನು ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ.' },
    components: { heading: 'ಘಟಕಗಳು', description: 'ನೂರಾರು ಮರುಬಳಕೆ ಮಾಡಬಹುದಾದ, ಪ್ರವೇಶಿಸಬಹುದಾದ ಘಟಕಗಳು, ಪ್ರತಿಯೊಂದೂ ದಾಖಲೆ ಮತ್ತು ಪ್ರದರ್ಶನದೊಂದಿಗೆ.' },
    examples: { heading: 'ಉದಾಹರಣೆಗಳು', description: 'ನೀವು ಕ್ಲೋನ್ ಮಾಡಿ ಹೊಂದಿಸಬಹುದಾದ ಏಳು ಸಂಪೂರ್ಣ, ಶೈಲೀಕೃತ ಉಲ್ಲೇಖ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು.' }
  }
};

const nb: UiStrings = {
  skipLink: 'Hopp til hovedinnholdet',
  brandAriaLabel: 'Lily Design System startside',
  nav: {
    home: 'Hjem',
    components: 'Komponenter',
    tutorials: 'Veiledninger',
    examples: 'Eksempler',
    skills: 'Ferdigheter',
    help: 'Hjelp',
    about: 'Om',
    github: 'GitHub'
  },
  footer: {
    license: 'Gratis åpen kildekode — BSD, MIT, Apache-2.0, GPL-2.0 eller GPL-3.0.',
    trademark: 'Lily™ og Lily Design System™ er varemerker.',
    why: 'Hvorfor Lily'
  },
  pickerLabels: {
    theme: 'Tema',
    locale: 'Språk',
    textSize: 'Tekststørrelse',
    share: 'Del',
    link: 'Steder',
    search: 'Søk',
    searchInput: 'Søkeord',
    searchSubmit: 'Søk'
  },
  home: {
    heroTitle: 'Bygg nettdesign bedre.',
    heroTagline: 'Lily er et gratis, åpen kildekode og tilgjengelig designsystem med hundrevis av komponenter for syv rammeverk.',
    frameworks: 'Støttede rammeverk',
    tutorials: { heading: 'Veiledninger', description: 'Lær Lily steg for steg, i det rammeverket du bruker.' },
    components: { heading: 'Komponenter', description: 'Hundrevis av gjenbrukbare, tilgjengelige komponenter, hver med dokumentasjon og demo.' },
    examples: { heading: 'Eksempler', description: 'Syv komplette, stilede referanseapplikasjoner du kan klone og tilpasse.' }
  }
};

const km: UiStrings = {
  skipLink: 'រំលងទៅខ្លឹមសារចម្បង',
  brandAriaLabel: 'ទំព័រដើមរបស់ Lily Design System',
  nav: {
    home: 'ទំព័រដើម',
    components: 'សមាសភាគ',
    tutorials: 'មេរៀន',
    examples: 'ឧទាហរណ៍',
    skills: 'ជំនាញ',
    help: 'ជំនួយ',
    about: 'អំពី',
    github: 'GitHub'
  },
  footer: {
    license: 'កម្មវិធីប្រភពបើកចំហឥតគិតថ្លៃ — BSD, MIT, Apache-2.0, GPL-2.0 ឬ GPL-3.0។',
    trademark: 'Lily™ និង Lily Design System™ ជាពាណិជ្ជសញ្ញា។',
    why: 'ហេតុអ្វីជ្រើសរើស Lily'
  },
  pickerLabels: {
    theme: 'ស្បែក',
    locale: 'ភាសា',
    textSize: 'ទំហំអក្សរ',
    share: 'ចែករំលែក',
    link: 'កន្លែង',
    search: 'ស្វែងរក',
    searchInput: 'ពាក្យស្វែងរក',
    searchSubmit: 'ស្វែងរក'
  },
  home: {
    heroTitle: 'បង្កើតការរចនាគេហទំព័រឱ្យកាន់តែប្រសើរ។',
    heroTagline: 'Lily ជាប្រព័ន្ធរចនាឥតគិតថ្លៃ ប្រភពបើកចំហ និងអាចចូលប្រើបាន ដែលមានសមាសភាគរាប់រយសម្រាប់ក្របខណ្ឌប្រាំពីរ។',
    frameworks: 'ក្របខណ្ឌដែលគាំទ្រ',
    tutorials: { heading: 'មេរៀន', description: 'រៀន Lily មួយជំហានម្តងៗ ក្នុងក្របខណ្ឌណាមួយដែលអ្នកប្រើ។' },
    components: { heading: 'សមាសភាគ', description: 'សមាសភាគរាប់រយដែលអាចប្រើឡើងវិញ និងអាចចូលប្រើបាន ដែលនីមួយៗមានឯកសារ និងការបង្ហាញ។' },
    examples: { heading: 'ឧទាហរណ៍', description: 'កម្មវិធីយោងពេញលេញប្រាំពីរដែលមានរចនាប័ទ្ម ដែលអ្នកអាចចម្លង និងកែសម្រួល។' }
  }
};

const lo: UiStrings = {
  skipLink: 'ຂ້າມໄປຫາເນື້ອໃນຫຼັກ',
  brandAriaLabel: 'ໜ້າຫຼັກ Lily Design System',
  nav: {
    home: 'ໜ້າຫຼັກ',
    components: 'ອົງປະກອບ',
    tutorials: 'ບົດສອນ',
    examples: 'ຕົວຢ່າງ',
    skills: 'ທັກສະ',
    help: 'ຊ່ວຍເຫຼືອ',
    about: 'ກ່ຽວກັບ',
    github: 'GitHub'
  },
  footer: {
    license: 'ຊອບແວໂອເພນຊອດຟຣີ — BSD, MIT, Apache-2.0, GPL-2.0 ຫຼື GPL-3.0.',
    trademark: 'Lily™ ແລະ Lily Design System™ ແມ່ນເຄື່ອງໝາຍການຄ້າ.',
    why: 'ເປັນຫຍັງຕ້ອງ Lily'
  },
  pickerLabels: {
    theme: 'ຮູບແບບສີສັນ',
    locale: 'ພາສາ',
    textSize: 'ຂະໜາດຕົວອັກສອນ',
    share: 'ແບ່ງປັນ',
    link: 'ສະຖານທີ່',
    search: 'ຄົ້ນຫາ',
    searchInput: 'ຄຳຄົ້ນຫາ',
    searchSubmit: 'ຄົ້ນຫາ'
  },
  home: {
    heroTitle: 'ສ້າງການອອກແບບເວັບໃຫ້ດີຂຶ້ນ.',
    heroTagline: 'Lily ແມ່ນລະບົບການອອກແບບຟຣີ, ໂອເພນຊອດ ແລະເຂົ້າເຖິງໄດ້ງ່າຍ ທີ່ມີອົງປະກອບຫຼາຍຮ້ອຍອັນສຳລັບເຈັດເຟຣມເວີກ.',
    frameworks: 'ເຟຣມເວີກທີ່ຮອງຮັບ',
    tutorials: { heading: 'ບົດສອນ', description: 'ຮຽນຮູ້ Lily ເທື່ອລະຂັ້ນຕອນ ໃນເຟຣມເວີກໃດກໍໄດ້ທີ່ທ່ານໃຊ້.' },
    components: { heading: 'ອົງປະກອບ', description: 'ອົງປະກອບຫຼາຍຮ້ອຍອັນທີ່ນຳກັບມາໃຊ້ໃໝ່ໄດ້ ແລະເຂົ້າເຖິງໄດ້ງ່າຍ, ແຕ່ລະອັນມີເອກະສານ ແລະການສາທິດ.' },
    examples: { heading: 'ຕົວຢ່າງ', description: 'ແອັບອ້າງອີງທີ່ສົມບູນ ແລະມີຮູບແບບເຈັດອັນ ທີ່ທ່ານສາມາດ clone ແລະປັບແຕ່ງໄດ້.' }
  }
};

const wuu: UiStrings = {
  skipLink: '跳到主要内容',
  brandAriaLabel: 'Lily Design System 首页',
  nav: {
    home: '首页',
    components: '组件',
    tutorials: '教程',
    examples: '例子',
    skills: '技能',
    help: '帮助',
    about: '关于',
    github: 'GitHub'
  },
  footer: {
    license: '免费开源软件 — BSD、MIT、Apache-2.0、GPL-2.0 或者 GPL-3.0。',
    trademark: 'Lily™ 搭 Lily Design System™ 是商标。',
    why: '为啥用 Lily'
  },
  pickerLabels: {
    theme: '主题',
    locale: '语言',
    textSize: '字体大小',
    share: '分享',
    link: '地方',
    search: '搜索',
    searchInput: '搜索关键词',
    searchSubmit: '搜索'
  },
  home: {
    heroTitle: '拿网页设计做得更好。',
    heroTagline: 'Lily 是一套免费、开源、人人用得来个设计系统,有几百个组件,支持七个框架。',
    frameworks: '支持个框架',
    tutorials: { heading: '教程', description: '一步一步学 Lily,侬用啥框架都可以。' },
    components: { heading: '组件', description: '几百个可以重复用、人人用得来个组件,每一个侪有文档搭演示。' },
    examples: { heading: '例子', description: '七个完整、带样式个参考应用,可以克隆过来改。' }
  }
};

const sco: UiStrings = {
  skipLink: 'Skip tae the main content',
  brandAriaLabel: 'Lily Design System hame',
  nav: {
    home: 'Hame',
    components: 'Components',
    tutorials: 'Tutorials',
    examples: 'Examples',
    skills: 'Skills',
    help: 'Help',
    about: 'Aboot',
    github: 'GitHub'
  },
  footer: {
    license: 'Free open source saftware — BSD, MIT, Apache-2.0, GPL-2.0 or GPL-3.0.',
    trademark: 'Lily™ an Lily Design System™ are tredemairks.',
    why: 'Why Lily'
  },
  pickerLabels: {
    theme: 'Theme',
    locale: 'Leid',
    textSize: 'Text size',
    share: 'Share',
    link: 'Places',
    search: 'Seek',
    searchInput: 'Seek wirds',
    searchSubmit: 'Seek'
  },
  home: {
    heroTitle: 'Big wab design better.',
    heroTagline: 'Lily is a free, open-source, accessible design system wi hunders o components for seiven frameworks.',
    frameworks: 'Supportit frameworks',
    tutorials: { heading: 'Tutorials', description: 'Lear Lily stap bi stap, in whitever framework ye uise.' },
    components: { heading: 'Components', description: 'Hunders o reuisable, accessible components, ilkane documentit an demonstratit.' },
    examples: { heading: 'Examples', description: 'Seiven complete, styled reference applications ye can clone an adjust.' }
  }
};

const kw: UiStrings = {
  skipLink: 'Lemmel dhe\'n dhrehevyans pennfenten',
  brandAriaLabel: 'Folen dre Lily Design System',
  nav: {
    home: 'Tre',
    components: 'Darnow',
    tutorials: 'Dyskansow',
    examples: 'Ensamplow',
    skills: 'Skians',
    help: 'Skoodhya',
    about: 'A-dro dhe',
    github: 'GitHub'
  },
  footer: {
    license: 'Medhelweyth ygor-fenten rydh — BSD, MIT, Apache-2.0, GPL-2.0 po GPL-3.0.',
    trademark: 'Lily™ ha Lily Design System™ yw nodhow-marghas.',
    why: 'Prag Lily'
  },
  pickerLabels: {
    theme: 'Tebel',
    locale: 'Yeth',
    textSize: 'Myns an skrif',
    share: 'Rannans',
    link: 'Plasow',
    search: 'Whelas',
    searchInput: 'Geryow whelas',
    searchSubmit: 'Whelas'
  },
  home: {
    heroTitle: 'Gwruwgh dyllans an gwiasva yn wella.',
    heroTagline: 'Lily yw system dyllans rydh, ygor-fenten ha hedhesys gans cans darnow rag seyth framwyth.',
    frameworks: 'Framwyth skoodhys',
    tutorials: { heading: 'Dyskansow', description: 'Dyskwgh Lily gradh ha gradh, y\'n framwyth a wrewgh devnydh anodho.' },
    components: { heading: 'Darnow', description: 'Cansow a darnow a yll bos devnydhys arta ha hedhesys, pub onan gans dhogynnans ha displetyans.' },
    examples: { heading: 'Ensamplow', description: 'Seyth appys kompletys ha stylys a yll bos klonys ha chanjys.' }
  }
};

const UI: Record<string, UiStrings> = {
  'ar-001': ar,
  'bg-001': bg,
  'bg-bg': bg,
  'bh-001': bh,
  'bn-001': bn,
  'cs-001': cs,
  'cs-cz': cs,
  'cy-001': cy,
  'cy-gb': cy,
  'da-001': da,
  'da-dk': da,
  'de-001': de,
  'de-at': de,
  'de-de': de,
  'el-001': el,
  'el-cy': el,
  'el-gr': el,
  'en-001': en,
  'en-gb': enGb,
  'en-gb-oxendict': enGbOxendict,
  'en-us': enUs,
  'es-001': es,
  'es-es': es,
  'et-001': et,
  'et-ee': et,
  'eu-001': eu,
  'eu-es': eu,
  'fa-001': fa,
  'fi-001': fi,
  'fi-fi': fi,
  'fr-001': fr,
  'fr-be': fr,
  'fr-fr': fr,
  'ga-001': ga,
  'ga-ie': ga,
  'gd-001': gd,
  'gd-gb': gd,
  'gu-001': gu,
  'ha-001': ha,
  'he-001': he,
  'hi-001': hi,
  'hi-in': hi,
  'hr-001': hr,
  'hr-hr': hr,
  'hu-001': hu,
  'hu-hu': hu,
  'id-001': id,
  'id-id': id,
  'is-001': is,
  'is-is': is,
  'it-001': it,
  'it-it': it,
  'ja-001': ja,
  'ja-jp': ja,
  'jv-001': jv,
  'km-001': km,
  'km-kh': km,
  'kn-001': kn,
  'ko-001': ko,
  'ko-kr': ko,
  'kw-001': kw,
  'kw-gb': kw,
  'lb-001': lb,
  'lb-lu': lb,
  'lo-001': lo,
  'lo-la': lo,
  'lt-001': lt,
  'lt-lt': lt,
  'lv-001': lv,
  'lv-lv': lv,
  'mr-001': mr,
  'ms-001': ms,
  'mt-001': mt,
  'mt-mt': mt,
  'nb-001': nb,
  'nb-no': nb,
  'nl-001': nl,
  'nl-nl': nl,
  'pa-001': pa,
  'pcm-001': pcm,
  'pl-001': pl,
  'pl-pl': pl,
  'pt-001': pt,
  'pt-pt': pt,
  'ro-001': ro,
  'ro-ro': ro,
  'ru-001': ru,
  'sco-gb': sco,
  'sk-001': sk,
  'sk-sk': sk,
  'sl-001': sl,
  'sl-si': sl,
  'sv-001': sv,
  'sv-se': sv,
  'sw-001': sw,
  'sw-tz': sw,
  'ta-001': ta,
  'te-001': te,
  'th-001': th,
  'th-th': th,
  'tl-001': tl,
  'tr-001': tr,
  'tr-tr': tr,
  'uk-001': uk,
  'ur-001': ur,
  'vi-001': vi,
  'vi-vn': vi,
  'wuu-001': wuu,
  'yue-001': yue,
  'zh-001': zh,
  'zh-cn': zh
};

/** Resolve a locale's UI chrome strings, falling back to the default locale. */
export function ui(locale: string): UiStrings {
  return UI[locale] ?? UI[DEFAULT_LOCALE];
}
