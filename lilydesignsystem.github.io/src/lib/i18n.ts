// UI chrome strings for the /locales/<code>/ tree: nav, footer, picker
// labels, and the localized home page's hero/card copy. Deeper content
// (tutorials, component docs, etc.) is not translated yet — see
// spec/locales-for-global-sharing-with-svelte/index.md's "starts empty"
// rollout note and each translation's own `home.notice` string, which
// says so in that locale's own language.
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
  };
  home: {
    heroTitle: string;
    heroTagline: string;
    findPath: string;
    tutorials: { heading: string; description: string };
    components: { heading: string; description: string };
    examples: { heading: string; description: string };
    notice: string;
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
    license: 'Free open source — BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0.',
    trademark: 'Lily™ and Lily Design System™ are trademarks.',
    why: 'Why Lily'
  },
  pickerLabels: {
    theme: 'Theme',
    locale: 'Language',
    textSize: 'Text size',
    share: 'Share'
  },
  home: {
    heroTitle: 'Build web designs better.',
    heroTagline:
      'Lily is a free, open-source, accessible design system with hundreds of components for seven frameworks.',
    findPath: 'Find your path',
    tutorials: {
      heading: 'Tutorials',
      description: 'Learn Lily step by step, in whichever framework you use.'
    },
    components: {
      heading: 'Component catalog',
      description:
        'Hundreds of reusable, accessible components, each documented and demonstrated.'
    },
    examples: {
      heading: 'Example apps',
      description: 'Seven complete, styled reference applications you can clone and adjust.'
    },
    notice:
      'This page is translated; deeper pages (tutorials, component docs) are still English-only for now.'
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
    share: 'Compartir'
  },
  home: {
    heroTitle: 'Diseña mejor para la web.',
    heroTagline:
      'Lily es un sistema de diseño gratuito, de código abierto y accesible, con cientos de componentes para siete frameworks.',
    findPath: 'Encuentra tu camino',
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
    },
    notice:
      'Esta página está traducida; las páginas más profundas (tutoriales, documentación de componentes) siguen disponibles solo en inglés por ahora.'
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
    share: 'Partager'
  },
  home: {
    heroTitle: 'Concevez mieux pour le web.',
    heroTagline:
      "Lily est un système de conception gratuit, open source et accessible, avec des centaines de composants pour sept frameworks.",
    findPath: 'Trouvez votre chemin',
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
    },
    notice:
      "Cette page est traduite ; les pages plus détaillées (tutoriels, documentation des composants) restent pour l'instant uniquement en anglais."
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
    share: 'Compartilhar'
  },
  home: {
    heroTitle: 'Crie designs melhores para a web.',
    heroTagline:
      'Lily é um sistema de design gratuito, de código aberto e acessível, com centenas de componentes para sete frameworks.',
    findPath: 'Encontre seu caminho',
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
    },
    notice:
      'Esta página está traduzida; páginas mais profundas (tutoriais, documentação de componentes) ainda estão disponíveis apenas em inglês.'
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
    share: 'Поделиться'
  },
  home: {
    heroTitle: 'Создавайте веб-дизайн лучше.',
    heroTagline:
      'Lily — бесплатная система дизайна с открытым исходным кодом и сотнями доступных компонентов для семи фреймворков.',
    findPath: 'Найдите свой путь',
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
    },
    notice:
      'Эта страница переведена; более глубокие страницы (уроки, документация компонентов) пока доступны только на английском языке.'
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
    share: 'साझा करें'
  },
  home: {
    heroTitle: 'वेब डिज़ाइन को बेहतर बनाइए।',
    heroTagline:
      'Lily एक निःशुल्क, ओपन-सोर्स, सुगम्य डिज़ाइन सिस्टम है जिसमें सात फ्रेमवर्क के लिए सैकड़ों कॉम्पोनेंट्स हैं।',
    findPath: 'अपना रास्ता खोजें',
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
    },
    notice: 'यह पेज अनुवादित है; गहरे पेज (ट्यूटोरियल, कॉम्पोनेंट दस्तावेज़) अभी केवल अंग्रेज़ी में उपलब्ध हैं।'
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
    share: 'Bagikan'
  },
  home: {
    heroTitle: 'Rancang desain web yang lebih baik.',
    heroTagline:
      'Lily adalah sistem desain gratis, sumber terbuka, dan aksesibel dengan ratusan komponen untuk tujuh framework.',
    findPath: 'Temukan jalur Anda',
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
    },
    notice:
      'Halaman ini sudah diterjemahkan; halaman yang lebih dalam (tutorial, dokumentasi komponen) untuk saat ini masih dalam bahasa Inggris.'
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
      'Meddalwedd rhad ac am ddim, ffynhonnell agored — BSD, MIT, Apache-2.0, GPL-2.0, neu GPL-3.0.',
    trademark: 'Mae Lily™ a Lily Design System™ yn nodau masnach.',
    why: 'Pam Lily'
  },
  pickerLabels: {
    theme: 'Thema',
    locale: 'Iaith',
    textSize: 'Maint testun',
    share: 'Rhannu'
  },
  home: {
    heroTitle: 'Dylunio gwe yn well.',
    heroTagline:
      "Mae Lily yn system ddylunio rhad ac am ddim, ffynhonnell agored, hygyrch gyda channoedd o gydrannau ar gyfer saith fframwaith.",
    findPath: "Dewch o hyd i'ch llwybr",
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
        "Saith cymhwysiad cyfeirio cyflawn, wedi'u steilio, y gallwch eu clonio a'u haddasu."
    },
    notice:
      "Mae'r dudalen hon wedi'i chyfieithu; mae tudalennau dyfnach (tiwtorialau, dogfennaeth cydrannau) yn Saesneg yn unig am y tro."
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
    share: 'مشاركة'
  },
  home: {
    heroTitle: 'صمّم الويب بشكل أفضل.',
    heroTagline: 'Lily نظام تصميم مجاني ومفتوح المصدر ويسهل الوصول إليه، يضم مئات المكوّنات لسبعة أطر عمل.',
    findPath: 'اعثر على مسارك',
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
    },
    notice: 'هذه الصفحة مترجمة؛ الصفحات الأعمق (الدروس، توثيق المكوّنات) لا تزال بالإنجليزية فقط في الوقت الحالي.'
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
    share: 'شیئر کریں'
  },
  home: {
    heroTitle: 'ویب ڈیزائن کو بہتر بنائیں۔',
    heroTagline:
      'Lily ایک مفت، اوپن سورس اور قابلِ رسائی ڈیزائن سسٹم ہے جس میں سات فریم ورکس کے لیے سیکڑوں اجزاء شامل ہیں۔',
    findPath: 'اپنا راستہ تلاش کریں',
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
    },
    notice: 'یہ صفحہ ترجمہ شدہ ہے؛ گہرے صفحات (سبق، اجزاء کی دستاویزات) فی الحال صرف انگریزی میں دستیاب ہیں۔'
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
    share: 'শেয়ার করুন'
  },
  home: {
    heroTitle: 'ওয়েব ডিজাইন আরও ভালো করুন।',
    heroTagline:
      'Lily একটি বিনামূল্যের, ওপেন-সোর্স, প্রবেশযোগ্য ডিজাইন সিস্টেম, যাতে সাতটি ফ্রেমওয়ার্কের জন্য শত শত কম্পোনেন্ট রয়েছে।',
    findPath: 'আপনার পথ খুঁজুন',
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
    },
    notice: 'এই পৃষ্ঠাটি অনূদিত; গভীর পৃষ্ঠাগুলো (টিউটোরিয়াল, কম্পোনেন্ট ডকুমেন্টেশন) আপাতত শুধু ইংরেজিতে উপলব্ধ।'
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
    share: '分享'
  },
  home: {
    heroTitle: '更好地设计网页。',
    heroTagline: 'Lily 是一个免费、开源、无障碍的设计系统,为七种框架提供数百个组件。',
    findPath: '找到适合你的路径',
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
    },
    notice: '本页面已翻译;更深入的页面(教程、组件文档)目前仍仅提供英文版本。'
  }
};

const UI: Record<string, UiStrings> = {
  'ar-001': ar,
  'bn-001': bn,
  'cy-001': cy,
  'en-001': en,
  'en-gb': enGb,
  'en-gb-oxendict': enGbOxendict,
  'en-us': enUs,
  'es-001': es,
  'fr-001': fr,
  'hi-001': hi,
  'id-001': id,
  'pt-001': pt,
  'ru-001': ru,
  'ur-001': ur,
  'zh-cn': zh
};

/** Resolve a locale's UI chrome strings, falling back to the default locale. */
export function ui(locale: string): UiStrings {
  return UI[locale] ?? UI[DEFAULT_LOCALE];
}
