<script lang="ts">
    // RTL demo (plan P6-T4). Proves the design principle stated in
    // AGENTS/internationalization.md -- "components do not assume LTR
    // layout in their structural HTML" -- with a real page: dir="rtl"
    // plus real Arabic content, using components (breadcrumb, data
    // table, pagination, a form with radios/checkboxes) that are the
    // classic places a design system silently bakes in "left" instead
    // of "start". Unlike every other composed page, the content here
    // is genuinely bidi rather than just localized, since dir="rtl"
    // is set once on the wrapper and inherited by everything inside.
    //
    // Building this surfaced two real findings, neither where I first
    // looked:
    //
    // 1. src/lib/css/nhs.css -- 2000+ lines, and the obvious place to
    //    look for RTL bugs -- is dead code. Nothing in this app imports
    //    it any more (grep the whole src/ tree); the real styling comes
    //    entirely from the runtime-swapped root themes/*.css this app's
    //    theme-picker loads (2026-08-26's "wire themes into example
    //    apps" work superseded it and nobody removed the file). Editing
    //    it, which an earlier draft of this page did, changes nothing a
    //    visitor ever sees. Left as-is here; removing genuinely-dead
    //    per-app CSS is a separate, larger cleanup than this route.
    // 2. The real file -- the default theme,
    //    themes/united-kingdom-national-health-service-england-for-patients.css
    //    -- already uses logical properties (margin-inline-end,
    //    padding-inline-start, border-inline-start, text-align: start)
    //    for every component this page touches: the breadcrumb
    //    separator, table headers, and inset-text all mirror correctly
    //    with no fix needed, verified against real computed styles in
    //    a live browser. It does have a few genuine physical-property
    //    bugs elsewhere (.timeline-list-item's border-left,
    //    .input-group's margin-left, .skip-link's left) -- none used on
    //    this page, so left as an honest, unfixed note rather than
    //    scope-creeping this route into a full theme audit.
    //
    // Verifying either finding raced against the same async
    // theme-stylesheet load already documented for the nunjucks-eleventy
    // app (base.njk's pre-paint <link>): a naive read right after
    // page.goto() can catch computed styles before the theme applies.
    // e2e/rtl-demo.spec.ts waits for the managed theme link's sheet to
    // populate, then two animation frames, before asserting anything
    // CSS-dependent -- confirmed 8/8 stable against that wait, versus a
    // real miss without it.
    import BackLink from "$lib/components/BackLink/BackLink.svelte";
    import BreadcrumbNav from "$lib/components/BreadcrumbNav/BreadcrumbNav.svelte";
    import BreadcrumbList from "$lib/components/BreadcrumbList/BreadcrumbList.svelte";
    import BreadcrumbListItem from "$lib/components/BreadcrumbListItem/BreadcrumbListItem.svelte";
    import InsetText from "$lib/components/InsetText/InsetText.svelte";
    import Form from "$lib/components/Form/Form.svelte";
    import Fieldset from "$lib/components/Fieldset/Fieldset.svelte";
    import Field from "$lib/components/Field/Field.svelte";
    import Label from "$lib/components/Label/Label.svelte";
    import RadioGroup from "$lib/components/RadioGroup/RadioGroup.svelte";
    import RadioInput from "$lib/components/RadioInput/RadioInput.svelte";
    import CheckboxInput from "$lib/components/CheckboxInput/CheckboxInput.svelte";
    import TextInput from "$lib/components/TextInput/TextInput.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import DataTable from "$lib/components/DataTable/DataTable.svelte";
    import DataTableHead from "$lib/components/DataTableHead/DataTableHead.svelte";
    import DataTableBody from "$lib/components/DataTableBody/DataTableBody.svelte";
    import DataTableRow from "$lib/components/DataTableRow/DataTableRow.svelte";
    import DataTableTH from "$lib/components/DataTableTH/DataTableTH.svelte";
    import DataTableTD from "$lib/components/DataTableTD/DataTableTD.svelte";
    import PaginationNav from "$lib/components/PaginationNav/PaginationNav.svelte";
    import PaginationList from "$lib/components/PaginationList/PaginationList.svelte";
    import PaginationListItem from "$lib/components/PaginationListItem/PaginationListItem.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";

    let contactMethod = $state("email");
    let agreeTerms = $state(false);
    let name = $state("");

    const rows = [
        { name: "سارة أحمد", department: "الموارد البشرية", status: "نشط" },
        { name: "محمد علي", department: "تقنية المعلومات", status: "نشط" },
        { name: "ليلى حسن", department: "المالية", status: "متوقف" },
    ];

    const currentPage = 2;
</script>

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
                {#each rows as row}
                    <DataTableRow>
                        <DataTableTD>{row.name}</DataTableTD>
                        <DataTableTD>{row.department}</DataTableTD>
                        <DataTableTD>{row.status}</DataTableTD>
                    </DataTableRow>
                {/each}
            </DataTableBody>
        </DataTable>

        <PaginationNav label="ترقيم صفحات النتائج">
            <PaginationList label="قائمة الصفحات">
                {#each [1, 2, 3, 4, 5] as page}
                    <PaginationListItem>
                        {#if page === currentPage}
                            <span aria-current="page">{page}</span>
                        {:else}
                            <a href="#page-{page}">{page}</a>
                        {/if}
                    </PaginationListItem>
                {/each}
            </PaginationList>
        </PaginationNav>

        <h2>نموذج التواصل</h2>
        <Form label="نموذج التواصل">
            <Field label="الاسم الكامل">
                <TextInput label="الاسم الكامل" bind:value={name} />
            </Field>

            <Fieldset legend="طريقة التواصل المفضلة">
                <RadioGroup label="طريقة التواصل المفضلة">
                    <Label>
                        <RadioInput
                            label="البريد الإلكتروني"
                            name="contact-method"
                            value="email"
                            checked={contactMethod === "email"}
                            onchange={() => (contactMethod = "email")}
                        />
                        البريد الإلكتروني
                    </Label>
                    <Label>
                        <RadioInput
                            label="الهاتف"
                            name="contact-method"
                            value="phone"
                            checked={contactMethod === "phone"}
                            onchange={() => (contactMethod = "phone")}
                        />
                        الهاتف
                    </Label>
                </RadioGroup>
            </Fieldset>

            <p>
                <Label>
                    <CheckboxInput label="أوافق على الشروط" bind:checked={agreeTerms} />
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
