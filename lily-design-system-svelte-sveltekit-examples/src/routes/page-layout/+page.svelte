<script lang="ts">
    import SkipLink from "$lib/components/SkipLink.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import NavigationMenu from "$lib/components/NavigationMenu.svelte";
    import BreadcrumbNav from "$lib/components/BreadcrumbNav.svelte";
    import BreadcrumbList from "$lib/components/BreadcrumbList.svelte";
    import BreadcrumbListItem from "$lib/components/BreadcrumbListItem.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import ContentsNav from "$lib/components/ContentsNav.svelte";
    import ContentsList from "$lib/components/ContentsList.svelte";
    import ContentsListItem from "$lib/components/ContentsListItem.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import InsetText from "$lib/components/InsetText.svelte";
    import InformationCallout from "$lib/components/InformationCallout.svelte";
    import WarningCallout from "$lib/components/WarningCallout.svelte";
    import CareCard from "$lib/components/CareCard.svelte";
    import MedicalBannerBoxForDanger from "$lib/components/MedicalBannerBoxForDanger.svelte";
    import BackLink from "$lib/components/BackLink.svelte";
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>NHS Service</h1>
        <NavigationMenu label="Main navigation">
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/contact-form">Contact</a>
        </NavigationMenu>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <BreadcrumbNav label="Breadcrumb">
        <BreadcrumbList>
            <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
            <BreadcrumbListItem
                ><a href="/page-layout">Health A to Z</a></BreadcrumbListItem
            >
            <BreadcrumbListItem current>Page Layout</BreadcrumbListItem>
        </BreadcrumbList>
    </BreadcrumbNav>

    <div
        style="display: grid; grid-template-columns: 250px 1fr; gap: var(--nhs-space-4);"
    >
        <Sidebar label="Page navigation">
            <h3>Navigation</h3>
            <ContentsNav label="On this page">
                <ContentsList>
                    <ContentsListItem
                        ><a href="#callouts">Callouts</a></ContentsListItem
                    >
                    <ContentsListItem
                        ><a href="#care-cards">Care Cards</a></ContentsListItem
                    >
                    <ContentsListItem
                        ><a href="#panels">Panels</a></ContentsListItem
                    >
                    <ContentsListItem
                        ><a href="#inset">Inset Text</a></ContentsListItem
                    >
                </ContentsList>
            </ContentsNav>
        </Sidebar>

        <div>
            <h2>Page Layout Example</h2>
            <p>
                This page demonstrates the layout components styled with NHS UK
                design tokens, including headers, footers, sidebars,
                breadcrumbs, and various content patterns.
            </p>

            <section id="callouts">
                <h3>Callouts</h3>

                <InformationCallout label="Key fact">
                    <h4>Did you know?</h4>
                    <p>
                        The NHS was established on 5 July 1948 and provides
                        healthcare that is free at the point of use for all UK
                        residents.
                    </p>
                </InformationCallout>

                <WarningCallout label="Important warning">
                    <h4>Important</h4>
                    <p>
                        If you are experiencing chest pain, call 999
                        immediately. Do not wait for symptoms to improve on
                        their own.
                    </p>
                </WarningCallout>
            </section>

            <section id="care-cards">
                <h3>Care Cards</h3>

                <CareCard type="non-urgent" heading="Speak to a GP if:">
                    <ul>
                        <li>Your symptoms have not improved after 2 weeks</li>
                        <li>You are worried about your symptoms</li>
                        <li>You need advice on managing your condition</li>
                    </ul>
                </CareCard>

                <CareCard
                    type="urgent"
                    heading="Ask for an urgent GP appointment or call 111 if:"
                >
                    <ul>
                        <li>
                            You have a high temperature that lasts more than 3
                            days
                        </li>
                        <li>You are finding it hard to breathe</li>
                    </ul>
                </CareCard>

                <CareCard type="immediate" heading="Call 999 if:">
                    <ul>
                        <li>You have sudden chest pain</li>
                        <li>You cannot breathe</li>
                        <li>You are having a seizure</li>
                    </ul>
                </CareCard>

                <MedicalBannerBoxForDanger label="Critical allergy information">
                    <h4>Allergies</h4>
                    <p>
                        <strong>Penicillin</strong> — Severe anaphylactic reaction.
                        Do NOT administer.
                    </p>
                </MedicalBannerBoxForDanger>
            </section>

            <section id="panels">
                <h3>Panels</h3>

                <Panel label="Summary panel">
                    <h4>Summary</h4>
                    <p>
                        This panel contains a summary of the key information on
                        this page.
                    </p>
                </Panel>

                <Panel label="Related content">
                    <h4>Related Topics</h4>
                    <ul>
                        <li><a href="/page-layout">Managing your health</a></li>
                        <li>
                            <a href="/page-layout">Finding local services</a>
                        </li>
                        <li><a href="/page-layout">Your health records</a></li>
                    </ul>
                </Panel>
            </section>

            <section id="inset">
                <h3>Inset Text</h3>

                <InsetText>
                    <p>
                        Information about a health condition should not replace
                        advice from your GP or specialist.
                    </p>
                </InsetText>
            </section>
        </div>
    </div>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <nav aria-label="Footer navigation">
            <ul
                style="list-style: none; padding: 0; display: flex; gap: var(--nhs-space-4);"
            >
                <li><a href="/page-layout">Accessibility statement</a></li>
                <li><a href="/page-layout">Contact us</a></li>
                <li><a href="/page-layout">Cookies</a></li>
                <li><a href="/page-layout">Terms and conditions</a></li>
            </ul>
        </nav>
        <p>Lily Design System — Page Layout Example</p>
    </div>
</Footer>
