// The demo's own words, in the locales its language picker offers. The helpers' labels come from the
// label packs in @lilydesignsystem/svelte-locale-translations; this file holds what no pack covers: the demo
// chrome and its sample data. All the non-English texts are machine drafts that no native speaker has checked.

export const DEMO_LOCALES = ['en-001', 'zh-001', 'hi-001', 'ar-001', 'cy-gb', 'es-es', 'fr-fr', 'en-gb', 'de-de'] as const;
export type DemoLocale = (typeof DEMO_LOCALES)[number];

export const LOCALE_NAMES: Record<DemoLocale, string> = {
  'en-001': 'English',
  'zh-001': '中文',
  'hi-001': 'हिन्दी',
  'ar-001': 'العربية',
  'cy-gb': 'Cymraeg',
  'es-es': 'Español',
  'fr-fr': 'Français',
  'en-gb': 'English (UK)',
  'de-de': 'Deutsch'
};

/** The label pack a locale uses: the pack for its language (`cy-gb` uses `cy-001`). */
export function packKey(locale: string): string {
  return `${locale.split('-')[0]}-001`;
}

export type PanelId = 'data-grid' | 'kanban-board' | 'gantt-chart' | 'calendar' | 'markdown-editor' | 'org-editor';
export const PANELS: PanelId[] = ['data-grid', 'kanban-board', 'gantt-chart', 'calendar', 'markdown-editor', 'org-editor'];

/** The editors' tool names, keyed by the tools' ids. */
export type ToolNames = Record<string, string>;

export type DemoStrings = {
  skip: string;
  headerNav: { components: string; tutorials: string; examples: string; help: string };
  railLabel: string;
  rails: { left: string; right: string; expand: string; collapse: string; dialogText: string; close: string };
  leftItems: { home: string; search: string; settings: string; help: string; email: string };
  rightItems: { users: string; groups: string; places: string; events: string; actions: string };
  panels: Record<PanelId, string>;
  aside: { title: string; body: string; tipsTitle: string; tips: string[] };
  footer: string;
  pickers: {
    link: string; theme: string; locale: string; textSize: string; share: string; search: string;
    searchInput: string; searchSubmit: string; copyLink: string; copied: string; copyFailed: string;
  };
  links: { home: string; components: string; help: string };
  statuses: { todo: string; doing: string; done: string };
  tasks: string[];
  owners: string[];
  grid: { label: string; task: string; owner: string; status: string; due: string; hours: string };
  kanban: { label: string };
  gantt: { label: string };
  calendar: { label: string; events: string[] };
  editor: {
    label: string; toolbarLabel: string; tools: ToolNames;
    markdownSample: string; orgSample: string;
  };
};

const en: DemoStrings = {
  skip: 'Skip to content',
  headerNav: { components: 'Components', tutorials: 'Tutorials', examples: 'Examples', help: 'Help' },
  railLabel: 'Demo panels',
  rails: { left: 'Shortcuts', right: 'Directory', expand: 'Expand', collapse: 'Collapse', dialogText: 'This is a demo icon button.', close: 'Close' },
  leftItems: { home: 'Home', search: 'Search', settings: 'Settings', help: 'Help', email: 'Email' },
  rightItems: { users: 'Users', groups: 'Groups', places: 'Places', events: 'Events', actions: 'Actions' },
  panels: { 'data-grid': 'Data grid', 'kanban-board': 'Kanban board', 'gantt-chart': 'Gantt chart', calendar: 'Calendar', 'markdown-editor': 'Markdown editor', 'org-editor': 'Org editor' },
  aside: {
    title: 'About this demo',
    body: 'Every control here is a headless Lily component, styled only by the selected theme. Change the language, theme or text size from the bar above.',
    tipsTitle: 'Try',
    tips: ['Tab into a grid, then use the arrow keys.', 'Switch to Arabic to see the layout mirror.', 'Pick another theme: the same markup, a different look.']
  },
  footer: 'Unreviewed machine translations; a native speaker should check the wording.',
  pickers: { link: 'Pages', theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share', search: 'Search', searchInput: 'Search terms', searchSubmit: 'Search', copyLink: 'Copy link', copied: 'Link copied', copyFailed: 'Could not copy' },
  links: { home: 'Home', components: 'Components', help: 'Help' },
  statuses: { todo: 'To do', doing: 'In progress', done: 'Done' },
  tasks: ['Write the spec', 'Design the layout', 'Build the grid', 'Review accessibility', 'Translate labels', 'Ship the release'],
  owners: ['Ana', 'Ben', 'Chen', 'Dara'],
  grid: { label: 'Tasks', task: 'Task', owner: 'Owner', status: 'Status', due: 'Due', hours: 'Hours' },
  kanban: { label: 'Task board' },
  gantt: { label: 'Release plan' },
  calendar: { label: 'Schedule', events: ['Planning', 'Review', 'Release'] },
  editor: {
    label: 'Notes', toolbarLabel: 'Formatting',
    tools: { heading: 'Heading', bold: 'Bold', italic: 'Italic', strikethrough: 'Strikethrough', code: 'Code', link: 'Link', quote: 'Quote', bulletList: 'Bulleted list', numberedList: 'Numbered list', todo: 'Task', priority: 'Priority', scheduled: 'Scheduled', deadline: 'Deadline', property: 'Property', drawer: 'Drawer', contact: 'Contact' },
    markdownSample: '# Release notes\n\nWrite **bold** or *italic* text, then press a button.\n\n- First item\n- Second item',
    orgSample: '* TODO Ship the release\n** Write the changelog\n** Translate the labels'
  }
};

const zh: DemoStrings = {
  skip: '跳到内容',
  headerNav: { components: '组件', tutorials: '教程', examples: '示例', help: '帮助' },
  railLabel: '演示面板',
  rails: { left: '快捷方式', right: '目录', expand: '展开', collapse: '折叠', dialogText: '这是一个演示图标按钮。', close: '关闭' },
  leftItems: { home: '首页', search: '搜索', settings: '设置', help: '帮助', email: '电子邮件' },
  rightItems: { users: '用户', groups: '群组', places: '地点', events: '事件', actions: '操作' },
  panels: { 'data-grid': '数据表格', 'kanban-board': '看板', 'gantt-chart': '甘特图', calendar: '日历', 'markdown-editor': 'Markdown 编辑器', 'org-editor': 'Org 编辑器' },
  aside: {
    title: '关于此演示',
    body: '这里的每个控件都是无样式的 Lily 组件，外观完全由所选主题决定。可在上方栏中更改语言、主题或文字大小。',
    tipsTitle: '试试',
    tips: ['按 Tab 进入表格，再用方向键移动。', '切换到阿拉伯语，查看布局镜像。', '换一个主题：同样的标记，不同的外观。']
  },
  footer: '机器翻译，尚未审校；请母语者核对措辞。',
  pickers: { link: '页面', theme: '主题', locale: '语言', textSize: '文字大小', share: '分享', search: '搜索', searchInput: '搜索词', searchSubmit: '搜索', copyLink: '复制链接', copied: '链接已复制', copyFailed: '无法复制' },
  links: { home: '首页', components: '组件', help: '帮助' },
  statuses: { todo: '待办', doing: '进行中', done: '已完成' },
  tasks: ['撰写规范', '设计布局', '构建表格', '审查无障碍', '翻译标签', '发布版本'],
  owners: ['安娜', '本', '陈', '达拉'],
  grid: { label: '任务', task: '任务', owner: '负责人', status: '状态', due: '截止', hours: '工时' },
  kanban: { label: '任务看板' },
  gantt: { label: '发布计划' },
  calendar: { label: '日程', events: ['规划', '评审', '发布'] },
  editor: {
    label: '笔记', toolbarLabel: '格式',
    tools: { heading: '标题', bold: '粗体', italic: '斜体', strikethrough: '删除线', code: '代码', link: '链接', quote: '引用', bulletList: '项目符号列表', numberedList: '编号列表', todo: '任务', priority: '优先级', scheduled: '计划', deadline: '截止日期', property: '属性', drawer: '抽屉', contact: '联系人' },
    markdownSample: '# 发布说明\n\n输入**粗体**或*斜体*文字，然后点按按钮。\n\n- 第一项\n- 第二项',
    orgSample: '* TODO 发布版本\n** 撰写更新日志\n** 翻译标签'
  }
};

const hi: DemoStrings = {
  skip: 'सामग्री पर जाएँ',
  headerNav: { components: 'घटक', tutorials: 'ट्यूटोरियल', examples: 'उदाहरण', help: 'सहायता' },
  railLabel: 'डेमो पैनल',
  rails: { left: 'शॉर्टकट', right: 'निर्देशिका', expand: 'फैलाएँ', collapse: 'समेटें', dialogText: 'यह एक डेमो आइकन बटन है।', close: 'बंद करें' },
  leftItems: { home: 'होम', search: 'खोजें', settings: 'सेटिंग्स', help: 'सहायता', email: 'ईमेल' },
  rightItems: { users: 'उपयोगकर्ता', groups: 'समूह', places: 'स्थान', events: 'आयोजन', actions: 'क्रियाएँ' },
  panels: { 'data-grid': 'डेटा ग्रिड', 'kanban-board': 'कानबन बोर्ड', 'gantt-chart': 'गैंट चार्ट', calendar: 'कैलेंडर', 'markdown-editor': 'Markdown संपादक', 'org-editor': 'Org संपादक' },
  aside: {
    title: 'इस डेमो के बारे में',
    body: 'यहाँ का हर नियंत्रण एक हेडलेस Lily घटक है, जिसकी शैली केवल चुने गए थीम से आती है। ऊपर की पट्टी से भाषा, थीम या पाठ का आकार बदलें।',
    tipsTitle: 'आज़माएँ',
    tips: ['Tab से ग्रिड में जाएँ, फिर तीर कुंजियाँ इस्तेमाल करें।', 'लेआउट का प्रतिबिंब देखने के लिए अरबी चुनें।', 'कोई और थीम चुनें: वही मार्कअप, अलग रूप।']
  },
  footer: 'अनसमीक्षित मशीनी अनुवाद; किसी मातृभाषी को शब्दों की जाँच करनी चाहिए।',
  pickers: { link: 'पृष्ठ', theme: 'थीम', locale: 'भाषा', textSize: 'पाठ का आकार', share: 'साझा करें', search: 'खोजें', searchInput: 'खोज शब्द', searchSubmit: 'खोजें', copyLink: 'लिंक कॉपी करें', copied: 'लिंक कॉपी हो गया', copyFailed: 'कॉपी नहीं हो सका' },
  links: { home: 'होम', components: 'घटक', help: 'सहायता' },
  statuses: { todo: 'करना है', doing: 'प्रगति में', done: 'पूरा' },
  tasks: ['विनिर्देश लिखें', 'लेआउट डिज़ाइन करें', 'ग्रिड बनाएँ', 'पहुँच-योग्यता की समीक्षा करें', 'लेबल अनुवाद करें', 'संस्करण जारी करें'],
  owners: ['अना', 'बेन', 'चेन', 'दारा'],
  grid: { label: 'कार्य', task: 'कार्य', owner: 'ज़िम्मेदार', status: 'स्थिति', due: 'देय', hours: 'घंटे' },
  kanban: { label: 'कार्य बोर्ड' },
  gantt: { label: 'रिलीज़ योजना' },
  calendar: { label: 'कार्यक्रम', events: ['योजना', 'समीक्षा', 'रिलीज़'] },
  editor: {
    label: 'टिप्पणियाँ', toolbarLabel: 'फ़ॉर्मेटिंग',
    tools: { heading: 'शीर्षक', bold: 'गाढ़ा', italic: 'तिरछा', strikethrough: 'काटा हुआ', code: 'कोड', link: 'लिंक', quote: 'उद्धरण', bulletList: 'बुलेट सूची', numberedList: 'क्रमांकित सूची', todo: 'कार्य', priority: 'प्राथमिकता', scheduled: 'निर्धारित', deadline: 'अंतिम तिथि', property: 'गुण', drawer: 'दराज़', contact: 'संपर्क' },
    markdownSample: '# रिलीज़ नोट्स\n\n**गाढ़ा** या *तिरछा* पाठ लिखें, फिर कोई बटन दबाएँ।\n\n- पहला आइटम\n- दूसरा आइटम',
    orgSample: '* TODO संस्करण जारी करें\n** चेंजलॉग लिखें\n** लेबल अनुवाद करें'
  }
};

const ar: DemoStrings = {
  skip: 'تخطَّ إلى المحتوى',
  headerNav: { components: 'المكوّنات', tutorials: 'الدروس', examples: 'أمثلة', help: 'المساعدة' },
  railLabel: 'لوحات العرض',
  rails: { left: 'اختصارات', right: 'الدليل', expand: 'توسيع', collapse: 'طيّ', dialogText: 'هذا زر أيقونة تجريبي.', close: 'إغلاق' },
  leftItems: { home: 'الرئيسية', search: 'بحث', settings: 'الإعدادات', help: 'المساعدة', email: 'البريد الإلكتروني' },
  rightItems: { users: 'المستخدمون', groups: 'المجموعات', places: 'الأماكن', events: 'الفعاليات', actions: 'الإجراءات' },
  panels: { 'data-grid': 'جدول البيانات', 'kanban-board': 'لوحة كانبان', 'gantt-chart': 'مخطط غانت', calendar: 'التقويم', 'markdown-editor': 'محرر Markdown', 'org-editor': 'محرر Org' },
  aside: {
    title: 'حول هذا العرض',
    body: 'كل عنصر هنا هو مكوّن Lily بلا تنسيق، ويتحدد مظهره بالسمة المختارة فقط. غيّر اللغة أو السمة أو حجم النص من الشريط أعلاه.',
    tipsTitle: 'جرّب',
    tips: ['انتقل إلى الجدول بمفتاح Tab ثم استخدم مفاتيح الأسهم.', 'اختر العربية لترى انعكاس التخطيط.', 'اختر سمة أخرى: نفس الترميز بمظهر مختلف.']
  },
  footer: 'ترجمة آلية غير مراجعة؛ ينبغي أن يراجع متحدث أصلي الصياغة.',
  pickers: { link: 'الصفحات', theme: 'السمة', locale: 'اللغة', textSize: 'حجم النص', share: 'مشاركة', search: 'بحث', searchInput: 'كلمات البحث', searchSubmit: 'بحث', copyLink: 'نسخ الرابط', copied: 'تم نسخ الرابط', copyFailed: 'تعذّر النسخ' },
  links: { home: 'الرئيسية', components: 'المكوّنات', help: 'المساعدة' },
  statuses: { todo: 'للتنفيذ', doing: 'قيد التنفيذ', done: 'مكتمل' },
  tasks: ['كتابة المواصفات', 'تصميم التخطيط', 'بناء الجدول', 'مراجعة إمكانية الوصول', 'ترجمة التسميات', 'إصدار النسخة'],
  owners: ['آنا', 'بن', 'تشن', 'دارا'],
  grid: { label: 'المهام', task: 'المهمة', owner: 'المسؤول', status: 'الحالة', due: 'الاستحقاق', hours: 'الساعات' },
  kanban: { label: 'لوحة المهام' },
  gantt: { label: 'خطة الإصدار' },
  calendar: { label: 'الجدول', events: ['التخطيط', 'المراجعة', 'الإصدار'] },
  editor: {
    label: 'ملاحظات', toolbarLabel: 'التنسيق',
    tools: { heading: 'عنوان', bold: 'غامق', italic: 'مائل', strikethrough: 'يتوسطه خط', code: 'شيفرة', link: 'رابط', quote: 'اقتباس', bulletList: 'قائمة نقطية', numberedList: 'قائمة مرقمة', todo: 'مهمة', priority: 'أولوية', scheduled: 'مجدول', deadline: 'الموعد النهائي', property: 'خاصية', drawer: 'درج', contact: 'جهة اتصال' },
    markdownSample: '# ملاحظات الإصدار\n\nاكتب نصًا **غامقًا** أو *مائلًا*، ثم اضغط زرًا.\n\n- العنصر الأول\n- العنصر الثاني',
    orgSample: '* TODO إصدار النسخة\n** كتابة سجل التغييرات\n** ترجمة التسميات'
  }
};

const cy: DemoStrings = {
  skip: "Neidio i'r cynnwys",
  headerNav: { components: "Cydrannau", tutorials: "Tiwtorialau", examples: "Enghreifftiau", help: "Cymorth" },
  railLabel: "Paneli arddangos",
  rails: { left: "Llwybrau byr", right: "Cyfeiriadur", expand: "Ehangu", collapse: "Cwympo", dialogText: "Botwm eicon arddangos yw hwn.", close: "Cau" },
  leftItems: { home: "Cartref", search: "Chwilio", settings: "Gosodiadau", help: "Cymorth", email: "E-bost" },
  rightItems: { users: "Defnyddwyr", groups: "Grwpiau", places: "Lleoedd", events: "Digwyddiadau", actions: "Gweithredoedd" },
  panels: { 'data-grid': "Grid data", 'kanban-board': "Bwrdd Kanban", 'gantt-chart': "Siart Gantt", calendar: "Calendr", 'markdown-editor': "Golygydd Markdown", 'org-editor': "Golygydd Org" },
  aside: {
    title: "Ynglŷn â'r arddangosiad hwn",
    body: "Mae pob rheolydd yma yn gydran Lily heb arddull, wedi'i steilio gan y thema a ddewiswyd yn unig. Newidiwch yr iaith, y thema neu faint y testun o'r bar uchod.",
    tipsTitle: "Rhowch gynnig ar hyn",
    tips: ["Defnyddiwch Tab i fynd i'r grid, yna'r bysellau saeth.", "Newidiwch i'r Arabeg i weld y cynllun yn adlewyrchu.", "Dewiswch thema arall: yr un marcio, golwg wahanol."]
  },
  footer: "Cyfieithiadau peirianyddol heb eu hadolygu; dylai siaradwr brodorol wirio'r geiriad.",
  pickers: { link: "Tudalennau", theme: "Thema", locale: "Iaith", textSize: "Maint y testun", share: "Rhannu", search: "Chwilio", searchInput: "Termau chwilio", searchSubmit: "Chwilio", copyLink: "Copïo'r cyswllt", copied: "Cyswllt wedi'i gopïo", copyFailed: "Methwyd copïo" },
  links: { home: "Cartref", components: "Cydrannau", help: "Cymorth" },
  statuses: { todo: "I'w wneud", doing: "Ar y gweill", done: "Wedi'i gwblhau" },
  tasks: ["Ysgrifennu'r fanyleb", "Dylunio'r cynllun", "Adeiladu'r grid", "Adolygu hygyrchedd", "Cyfieithu labeli", "Cyhoeddi'r fersiwn"],
  owners: ['Ana', 'Ben', 'Chen', 'Dara'],
  grid: { label: "Tasgau", task: "Tasg", owner: "Perchennog", status: "Statws", due: "Dyddiad dyledus", hours: "Oriau" },
  kanban: { label: "Bwrdd tasgau" },
  gantt: { label: "Cynllun rhyddhau" },
  calendar: { label: "Amserlen", events: ["Cynllunio", "Adolygu", "Rhyddhau"] },
  editor: {
    label: "Nodiadau", toolbarLabel: "Fformatio",
    tools: { heading: "Pennawd", bold: "Trwm", italic: "Italig", strikethrough: "Llinell drwodd", code: "Cod", link: "Dolen", quote: "Dyfyniad", bulletList: "Rhestr bwled", numberedList: "Rhestr wedi'i rhifo", todo: "Tasg", priority: "Blaenoriaeth", scheduled: "Wedi'i drefnu", deadline: "Terfyn amser", property: "Priodwedd", drawer: "Drôr", contact: "Cyswllt" },
    markdownSample: "# Nodiadau rhyddhau\n\nYsgrifennwch destun **trwm** neu *italig*, yna pwyswch fotwm.\n\n- Eitem gyntaf\n- Ail eitem",
    orgSample: "* TODO Cyhoeddi'r fersiwn\n** Ysgrifennu'r log newidiadau\n** Cyfieithu'r labeli"
  }
};

const es: DemoStrings = {
  skip: "Saltar al contenido",
  headerNav: { components: "Componentes", tutorials: "Tutoriales", examples: "Ejemplos", help: "Ayuda" },
  railLabel: "Paneles de la demostración",
  rails: { left: "Accesos directos", right: "Directorio", expand: "Expandir", collapse: "Contraer", dialogText: "Este es un botón de icono de demostración.", close: "Cerrar" },
  leftItems: { home: "Inicio", search: "Buscar", settings: "Ajustes", help: "Ayuda", email: "Correo electrónico" },
  rightItems: { users: "Usuarios", groups: "Grupos", places: "Lugares", events: "Eventos", actions: "Acciones" },
  panels: { 'data-grid': "Cuadrícula de datos", 'kanban-board': "Tablero Kanban", 'gantt-chart': "Diagrama de Gantt", calendar: "Calendario", 'markdown-editor': "Editor de Markdown", 'org-editor': "Editor de Org" },
  aside: {
    title: "Acerca de esta demostración",
    body: "Cada control de aquí es un componente Lily sin estilos, que solo toma su aspecto del tema elegido. Cambia el idioma, el tema o el tamaño del texto desde la barra superior.",
    tipsTitle: "Prueba",
    tips: ["Pulsa Tab para entrar en una cuadrícula y usa las teclas de flecha.", "Cambia al árabe para ver cómo se refleja el diseño.", "Elige otro tema: el mismo marcado, otro aspecto."]
  },
  footer: "Traducciones automáticas sin revisar; un hablante nativo debería comprobar la redacción.",
  pickers: { link: "Páginas", theme: "Tema", locale: "Idioma", textSize: "Tamaño del texto", share: "Compartir", search: "Buscar", searchInput: "Términos de búsqueda", searchSubmit: "Buscar", copyLink: "Copiar enlace", copied: "Enlace copiado", copyFailed: "No se pudo copiar" },
  links: { home: "Inicio", components: "Componentes", help: "Ayuda" },
  statuses: { todo: "Por hacer", doing: "En curso", done: "Hecho" },
  tasks: ["Redactar la especificación", "Diseñar la disposición", "Construir la cuadrícula", "Revisar la accesibilidad", "Traducir las etiquetas", "Publicar la versión"],
  owners: ['Ana', 'Ben', 'Chen', 'Dara'],
  grid: { label: "Tareas", task: "Tarea", owner: "Responsable", status: "Estado", due: "Vencimiento", hours: "Horas" },
  kanban: { label: "Tablero de tareas" },
  gantt: { label: "Plan de lanzamiento" },
  calendar: { label: "Agenda", events: ["Planificación", "Revisión", "Lanzamiento"] },
  editor: {
    label: "Notas", toolbarLabel: "Formato",
    tools: { heading: "Encabezado", bold: "Negrita", italic: "Cursiva", strikethrough: "Tachado", code: "Código", link: "Enlace", quote: "Cita", bulletList: "Lista con viñetas", numberedList: "Lista numerada", todo: "Tarea", priority: "Prioridad", scheduled: "Programada", deadline: "Fecha límite", property: "Propiedad", drawer: "Cajón", contact: "Contacto" },
    markdownSample: "# Notas de la versión\n\nEscribe texto en **negrita** o en *cursiva* y pulsa un botón.\n\n- Primer elemento\n- Segundo elemento",
    orgSample: "* TODO Publicar la versión\n** Redactar el registro de cambios\n** Traducir las etiquetas"
  }
};

const fr: DemoStrings = {
  skip: "Aller au contenu",
  headerNav: { components: "Composants", tutorials: "Tutoriels", examples: "Exemples", help: "Aide" },
  railLabel: "Panneaux de démonstration",
  rails: { left: "Raccourcis", right: "Annuaire", expand: "Développer", collapse: "Réduire", dialogText: "Ceci est un bouton d'icône de démonstration.", close: "Fermer" },
  leftItems: { home: "Accueil", search: "Rechercher", settings: "Paramètres", help: "Aide", email: "E-mail" },
  rightItems: { users: "Utilisateurs", groups: "Groupes", places: "Lieux", events: "Événements", actions: "Actions" },
  panels: { 'data-grid': "Grille de données", 'kanban-board': "Tableau Kanban", 'gantt-chart': "Diagramme de Gantt", calendar: "Calendrier", 'markdown-editor': "Éditeur Markdown", 'org-editor': "Éditeur Org" },
  aside: {
    title: "À propos de cette démonstration",
    body: "Chaque contrôle ici est un composant Lily sans style, dont l'apparence dépend uniquement du thème choisi. Changez la langue, le thème ou la taille du texte depuis la barre ci-dessus.",
    tipsTitle: "À essayer",
    tips: ["Entrez dans une grille avec Tab, puis utilisez les touches fléchées.", "Passez à l'arabe pour voir la mise en page se refléter.", "Choisissez un autre thème : le même balisage, un autre aspect."]
  },
  footer: "Traductions automatiques non relues ; un locuteur natif devrait vérifier la formulation.",
  pickers: { link: "Pages", theme: "Thème", locale: "Langue", textSize: "Taille du texte", share: "Partager", search: "Rechercher", searchInput: "Termes de recherche", searchSubmit: "Rechercher", copyLink: "Copier le lien", copied: "Lien copié", copyFailed: "Copie impossible" },
  links: { home: "Accueil", components: "Composants", help: "Aide" },
  statuses: { todo: "À faire", doing: "En cours", done: "Terminé" },
  tasks: ["Rédiger la spécification", "Concevoir la mise en page", "Construire la grille", "Vérifier l'accessibilité", "Traduire les libellés", "Publier la version"],
  owners: ['Ana', 'Ben', 'Chen', 'Dara'],
  grid: { label: "Tâches", task: "Tâche", owner: "Responsable", status: "Statut", due: "Échéance", hours: "Heures" },
  kanban: { label: "Tableau des tâches" },
  gantt: { label: "Plan de livraison" },
  calendar: { label: "Planning", events: ["Planification", "Revue", "Livraison"] },
  editor: {
    label: "Notes", toolbarLabel: "Mise en forme",
    tools: { heading: "Titre", bold: "Gras", italic: "Italique", strikethrough: "Barré", code: "Code", link: "Lien", quote: "Citation", bulletList: "Liste à puces", numberedList: "Liste numérotée", todo: "Tâche", priority: "Priorité", scheduled: "Planifié", deadline: "Échéance", property: "Propriété", drawer: "Tiroir", contact: "Contact" },
    markdownSample: "# Notes de version\n\nÉcrivez du texte en **gras** ou en *italique*, puis appuyez sur un bouton.\n\n- Premier élément\n- Deuxième élément",
    orgSample: "* TODO Publier la version\n** Rédiger le journal des modifications\n** Traduire les libellés"
  }
};

const de: DemoStrings = {
  skip: "Zum Inhalt springen",
  headerNav: { components: "Komponenten", tutorials: "Tutorials", examples: "Beispiele", help: "Hilfe" },
  railLabel: "Demo-Bereiche",
  rails: { left: "Schnellzugriff", right: "Verzeichnis", expand: "Erweitern", collapse: "Einklappen", dialogText: "Dies ist eine Demo-Symbolschaltfläche.", close: "Schließen" },
  leftItems: { home: "Startseite", search: "Suchen", settings: "Einstellungen", help: "Hilfe", email: "E-Mail" },
  rightItems: { users: "Benutzer", groups: "Gruppen", places: "Orte", events: "Ereignisse", actions: "Aktionen" },
  panels: { 'data-grid': "Datentabelle", 'kanban-board': "Kanban-Board", 'gantt-chart': "Gantt-Diagramm", calendar: "Kalender", 'markdown-editor': "Markdown-Editor", 'org-editor': "Org-Editor" },
  aside: {
    title: "Über diese Demo",
    body: "Jedes Steuerelement hier ist eine Lily-Komponente ohne eigenes Aussehen; das Design kommt allein vom gewählten Theme. Ändern Sie Sprache, Theme oder Textgröße in der Leiste oben.",
    tipsTitle: "Ausprobieren",
    tips: ["Mit Tab in eine Tabelle wechseln, dann die Pfeiltasten benutzen.", "Wechseln Sie zu Arabisch, um die gespiegelte Anordnung zu sehen.", "Wählen Sie ein anderes Theme: dasselbe Markup, ein anderes Aussehen."]
  },
  footer: "Ungeprüfte maschinelle Übersetzungen; ein Muttersprachler sollte den Wortlaut prüfen.",
  pickers: { link: "Seiten", theme: "Theme", locale: "Sprache", textSize: "Textgröße", share: "Teilen", search: "Suchen", searchInput: "Suchbegriffe", searchSubmit: "Suchen", copyLink: "Link kopieren", copied: "Link kopiert", copyFailed: "Kopieren nicht möglich" },
  links: { home: "Startseite", components: "Komponenten", help: "Hilfe" },
  statuses: { todo: "Offen", doing: "In Arbeit", done: "Erledigt" },
  tasks: ["Spezifikation schreiben", "Layout entwerfen", "Tabelle bauen", "Barrierefreiheit prüfen", "Beschriftungen übersetzen", "Version veröffentlichen"],
  owners: ['Ana', 'Ben', 'Chen', 'Dara'],
  grid: { label: "Aufgaben", task: "Aufgabe", owner: "Verantwortlich", status: "Status", due: "Fällig", hours: "Stunden" },
  kanban: { label: "Aufgaben-Board" },
  gantt: { label: "Veröffentlichungsplan" },
  calendar: { label: "Terminplan", events: ["Planung", "Prüfung", "Veröffentlichung"] },
  editor: {
    label: "Notizen", toolbarLabel: "Formatierung",
    tools: { heading: "Überschrift", bold: "Fett", italic: "Kursiv", strikethrough: "Durchgestrichen", code: "Code", link: "Link", quote: "Zitat", bulletList: "Aufzählung", numberedList: "Nummerierte Liste", todo: "Aufgabe", priority: "Priorität", scheduled: "Geplant", deadline: "Frist", property: "Eigenschaft", drawer: "Schublade", contact: "Kontakt" },
    markdownSample: "# Versionshinweise\n\nSchreiben Sie **fetten** oder *kursiven* Text und drücken Sie dann eine Schaltfläche.\n\n- Erster Eintrag\n- Zweiter Eintrag",
    orgSample: "* TODO Version veröffentlichen\n** Änderungsprotokoll schreiben\n** Beschriftungen übersetzen"
  }
};

// British English differs from the world English of en-001 in dates and numbers (through Intl) and in little else here.
export const STRINGS: Record<DemoLocale, DemoStrings> = {
  'en-001': en,
  'zh-001': zh,
  'hi-001': hi,
  'ar-001': ar,
  'cy-gb': cy,
  'es-es': es,
  'fr-fr': fr,
  'en-gb': en,
  'de-de': de
};

/** `YYYY-MM-DD` for `today` plus `days`, by UTC arithmetic (no time zone drift). */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}
