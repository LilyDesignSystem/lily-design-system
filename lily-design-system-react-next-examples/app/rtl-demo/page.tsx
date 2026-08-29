"use client";

// RTL demo (plan P6-T4), ported from the canonical SvelteKit reference
// (lily-design-system-svelte-sveltekit-examples/src/routes/rtl-demo/+page.svelte,
// plan P6-T4 origin). Proves the design principle stated in
// AGENTS/internationalization.md -- "components do not assume LTR
// layout in their structural HTML" -- with a real page: dir="rtl" plus
// real Arabic content, using components (breadcrumb, data table,
// pagination, a form with radios/checkboxes) that are the classic
// places a design system silently bakes in "left" instead of "start".
// Unlike every other composed page, the content here is genuinely bidi
// rather than just localized, since dir="rtl" is set once on the
// wrapper and inherited by everything inside. The wrapper carries its
// own Header/main/Footer (not the persistent global app-shell chrome
// in app/layout.tsx and site-header.tsx, which stays LTR and is not
// touched here), exactly as the Svelte reference does.
//
// Re-verifying the Svelte reference's two documented findings for this
// app specifically:
//
// 1. assets/css/nhs.css -- 2031 lines, the obvious place to look for
//    RTL bugs -- is dead code here too. Nothing in this app imports it
//    (grepped the whole tree; only a comment in assets/css/app-shell.css
//    mentions its name). The real styling comes entirely from the
//    runtime-swapped root themes/*.css that this app's theme-picker
//    prePaint script loads via a managed
//    <link data-lily-theme-picker="theme">, confirmed by reading
//    app/layout.tsx and app-shell.css's own header comment ("Everything
//    Lily-component-shaped comes from the runtime theme stylesheet").
//    Left as-is; removing genuinely-dead per-app CSS is a separate,
//    larger cleanup than this route.
// 2. The real file -- the default theme,
//    themes/united-kingdom-national-health-service-england-for-patients.css
//    -- already uses logical properties (margin-inline-end,
//    padding-inline-start, border-inline-start, text-align: start) for
//    every component this page touches, verified against real computed
//    styles in a live browser. No change needed to the shared file for
//    this app.
//
// Verifying either finding races the same async theme-stylesheet load
// documented for the Svelte and nunjucks-eleventy apps: the prePaint
// script's <link> is created before hydration but its stylesheet can
// still finish loading after page.goto() resolves. e2e/rtl-demo.spec.ts
// waits for the managed theme link's sheet to populate, then two
// animation frames, before asserting anything CSS-dependent.

import { useState } from "react";
import Header from "@lily/Header";
import Footer from "@lily/Footer";
import BackLink from "@lily/BackLink";
import BreadcrumbNav from "@lily/BreadcrumbNav";
import BreadcrumbList from "@lily/BreadcrumbList";
import BreadcrumbListItem from "@lily/BreadcrumbListItem";
import InsetText from "@lily/InsetText";
import DataTable from "@lily/DataTable";
import DataTableHead from "@lily/DataTableHead";
import DataTableBody from "@lily/DataTableBody";
import DataTableRow from "@lily/DataTableRow";
import DataTableTH from "@lily/DataTableTH";
import DataTableTD from "@lily/DataTableTD";
import PaginationNav from "@lily/PaginationNav";
import PaginationList from "@lily/PaginationList";
import PaginationListItem from "@lily/PaginationListItem";
import Form from "@lily/Form";
import Fieldset from "@lily/Fieldset";
import Field from "@lily/Field";
import Label from "@lily/Label";
import RadioGroup from "@lily/RadioGroup";
import RadioInput from "@lily/RadioInput";
import CheckboxInput from "@lily/CheckboxInput";
import TextInput from "@lily/TextInput";
import Button from "@lily/Button";

const rows = [
    { name: "سارة أحمد", department: "الموارد البشرية", status: "نشط" },
    { name: "محمد علي", department: "تقنية المعلومات", status: "نشط" },
    { name: "ليلى حسن", department: "المالية", status: "متوقف" },
];

const currentPage = 2;

export default function RtlDemoPage() {
    const [name, setName] = useState("");
    const [contactMethod, setContactMethod] = useState<"email" | "phone">(
        "email",
    );
    const [agreeTerms, setAgreeTerms] = useState(false);

    return (
        <div dir="rtl" lang="ar">
            <Header label="ترويسة الموقع">
                <div className="page-wrapper">
                    <h1>عرض توضيحي للكتابة من اليمين إلى اليسار</h1>
                </div>
            </Header>

            <main className="page-wrapper">
                <BackLink href="/">رجوع إلى الأمثلة</BackLink>

                <BreadcrumbNav label="مسار التصفح">
                    <BreadcrumbList>
                        <BreadcrumbListItem>
                            <a href="/">الرئيسية</a>
                        </BreadcrumbListItem>
                        <BreadcrumbListItem>
                            <a href="/components">الإعدادات</a>
                        </BreadcrumbListItem>
                        <BreadcrumbListItem current>
                            الملف الشخصي
                        </BreadcrumbListItem>
                    </BreadcrumbList>
                </BreadcrumbNav>

                <InsetText>
                    هذه صفحة تجريبية لاختبار الاتجاه من اليمين إلى اليسار.
                    جميع المكوّنات هنا بلا تنسيق مسبق؛ التنسيق البصري كله من
                    هذا التطبيق.
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
                        {rows.map((row) => (
                            <DataTableRow key={row.name}>
                                <DataTableTD>{row.name}</DataTableTD>
                                <DataTableTD>{row.department}</DataTableTD>
                                <DataTableTD>{row.status}</DataTableTD>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>

                <PaginationNav label="ترقيم صفحات النتائج">
                    <PaginationList label="قائمة الصفحات">
                        {[1, 2, 3, 4, 5].map((page) => (
                            <PaginationListItem key={page}>
                                {page === currentPage ? (
                                    <span aria-current="page">{page}</span>
                                ) : (
                                    <a href={`#page-${page}`}>{page}</a>
                                )}
                            </PaginationListItem>
                        ))}
                    </PaginationList>
                </PaginationNav>

                <h2>نموذج التواصل</h2>
                <Form label="نموذج التواصل" noValidate>
                    <Field label="الاسم الكامل">
                        <TextInput
                            label="الاسم الكامل"
                            value={name}
                            onChange={setName}
                        />
                    </Field>

                    <Fieldset legend="طريقة التواصل المفضلة">
                        <RadioGroup label="طريقة التواصل المفضلة">
                            <Label>
                                <RadioInput
                                    label="البريد الإلكتروني"
                                    name="contact-method"
                                    value="email"
                                    checked={contactMethod === "email"}
                                    onChange={() => setContactMethod("email")}
                                />
                                البريد الإلكتروني
                            </Label>
                            <Label>
                                <RadioInput
                                    label="الهاتف"
                                    name="contact-method"
                                    value="phone"
                                    checked={contactMethod === "phone"}
                                    onChange={() => setContactMethod("phone")}
                                />
                                الهاتف
                            </Label>
                        </RadioGroup>
                    </Fieldset>

                    <p>
                        <Label>
                            <CheckboxInput
                                label="أوافق على الشروط"
                                checked={agreeTerms}
                                onChange={setAgreeTerms}
                            />
                            أوافق على الشروط
                        </Label>
                    </p>

                    <p>
                        <Button type="submit">إرسال</Button>
                    </p>
                </Form>
            </main>

            <Footer label="تذييل الموقع">
                <div className="page-wrapper">
                    <p>نظام Lily للتصميم — عرض توضيحي للكتابة من اليمين إلى اليسار</p>
                </div>
            </Footer>
        </div>
    );
}
