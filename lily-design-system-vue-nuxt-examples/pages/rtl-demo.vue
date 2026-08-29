<script setup lang="ts">
// RTL demo (plan P6-T4), ported from the canonical SvelteKit reference at
// lily-design-system-svelte-sveltekit-examples/src/routes/rtl-demo/+page.svelte.
// Proves the design principle stated in AGENTS/internationalization.md --
// "components do not assume LTR layout in their structural HTML" -- with a
// real page: dir="rtl" plus real Arabic content, using components
// (breadcrumb, data table, pagination, a form with radios/checkboxes) that
// are the classic places a design system silently bakes in "left" instead
// of "start". Unlike every other composed page, the content here is
// genuinely bidi rather than just localized, since dir="rtl" is set once
// on the wrapper and inherited by everything inside.
//
// Re-verified the canonical reference's two findings for this app rather
// than assuming they carry over:
//
// 1. assets/css/nhs.css -- 2000+ lines, and the obvious place to look for
//    RTL bugs -- is dead code here too. Nothing in this app imports it
//    (grep the whole app: only nuxt.config.ts's `css:` array is wired, and
//    it lists only assets/css/app-shell.css). The real styling comes
//    entirely from the runtime-swapped root themes/*.css that this app's
//    pre-paint script + theme-picker load (see nuxt.config.ts). Left
//    as-is here; removing genuinely-dead per-app CSS is a separate, larger
//    cleanup than this route.
// 2. The real file -- the default theme,
//    themes/united-kingdom-national-health-service-england-for-patients.css
//    -- already uses logical properties (margin-inline-end,
//    padding-inline-start, border-inline-start, text-align: start) for
//    every component this page touches: the breadcrumb separator, table
//    headers, and inset-text all mirror correctly with no fix needed,
//    confirmed against real computed styles via this app's own e2e run.
//    No changes needed to the shared themes/*.css file for this app.
//
// Verifying either finding races the same async theme-stylesheet load
// documented for the SvelteKit and nunjucks-eleventy apps: this app's
// pre-paint <script> in nuxt.config.ts creates the managed
// <link data-lily-theme-picker="theme"> before first paint, but its
// stylesheet still loads asynchronously. e2e/rtl-demo.spec.ts waits for
// that link's sheet to populate, then two animation frames, before
// asserting anything CSS-dependent.
import { ref } from "vue";

const rows = [
    { name: "سارة أحمد", department: "الموارد البشرية", status: "نشط" },
    { name: "محمد علي", department: "تقنية المعلومات", status: "نشط" },
    { name: "ليلى حسن", department: "المالية", status: "متوقف" },
];

const currentPage = 2;

const contactMethod = ref<"email" | "phone">("email");
const agreeTerms = ref(false);
const name = ref("");
</script>

<template>
    <div dir="rtl" lang="ar">
        <Header label="ترويسة الموقع">
            <div class="page-wrapper">
                <h1>عرض توضيحي للكتابة من اليمين إلى اليسار</h1>
            </div>
        </Header>

        <main class="page-wrapper">
            <BackLink href="/">رجوع إلى الأمثلة</BackLink>

            <BreadcrumbNav label="مسار التصفح">
                <BreadcrumbList>
                    <BreadcrumbListItem><a href="/">الرئيسية</a></BreadcrumbListItem>
                    <BreadcrumbListItem><a href="/components">الإعدادات</a></BreadcrumbListItem>
                    <BreadcrumbListItem current>الملف الشخصي</BreadcrumbListItem>
                </BreadcrumbList>
            </BreadcrumbNav>

            <InsetText>
                هذه صفحة تجريبية لاختبار الاتجاه من اليمين إلى اليسار. جميع
                المكوّنات هنا بلا تنسيق مسبق؛ التنسيق البصري كله من هذا التطبيق.
            </InsetText>

            <h2>جدول الموظفين</h2>
            <DataTable label="قائمة الموظفين">
                <DataTableHead>
                    <DataTableRow>
                        <DataTableTH>الاسم</DataTableTH>
                        <DataTableTH>القسم</DataTableTH>
                        <DataTableTH>الحالة</DataTableTH>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    <DataTableRow v-for="row in rows" :key="row.name">
                        <DataTableTD>{{ row.name }}</DataTableTD>
                        <DataTableTD>{{ row.department }}</DataTableTD>
                        <DataTableTD>{{ row.status }}</DataTableTD>
                    </DataTableRow>
                </DataTableBody>
            </DataTable>

            <PaginationNav label="ترقيم صفحات النتائج">
                <PaginationList label="قائمة الصفحات">
                    <PaginationListItem v-for="page in [1, 2, 3, 4, 5]" :key="page">
                        <span v-if="page === currentPage" aria-current="page">{{ page }}</span>
                        <a v-else :href="`#page-${page}`">{{ page }}</a>
                    </PaginationListItem>
                </PaginationList>
            </PaginationNav>

            <h2>نموذج التواصل</h2>
            <Form label="نموذج التواصل">
                <Field label="الاسم الكامل">
                    <TextInput label="الاسم الكامل" v-model="name" />
                </Field>

                <Fieldset legend="طريقة التواصل المفضلة">
                    <RadioGroup label="طريقة التواصل المفضلة">
                        <Label>
                            <RadioInput
                                label="البريد الإلكتروني"
                                name="contact-method"
                                value="email"
                                :checked="contactMethod === 'email'"
                                @change="contactMethod = 'email'"
                            />
                            البريد الإلكتروني
                        </Label>
                        <Label>
                            <RadioInput
                                label="الهاتف"
                                name="contact-method"
                                value="phone"
                                :checked="contactMethod === 'phone'"
                                @change="contactMethod = 'phone'"
                            />
                            الهاتف
                        </Label>
                    </RadioGroup>
                </Fieldset>

                <p>
                    <Label>
                        <CheckboxInput label="أوافق على الشروط" v-model:checked="agreeTerms" />
                        أوافق على الشروط
                    </Label>
                </p>

                <p><Button type="submit">إرسال</Button></p>
            </Form>
        </main>

        <Footer label="تذييل الموقع">
            <div class="page-wrapper">
                <p>نظام Lily للتصميم — عرض توضيحي للكتابة من اليمين إلى اليسار</p>
            </div>
        </Footer>
    </div>
</template>
