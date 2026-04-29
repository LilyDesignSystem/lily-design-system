<script lang="ts">
    import TimelineList from "$lib/components/TimelineList.svelte";
    import TimelineListItem from "$lib/components/TimelineListItem.svelte";
    import Card from "$lib/components/Card.svelte";
    import Badge from "$lib/components/Badge.svelte";
    import DateRange from "$lib/components/DateRange.svelte";
    import ReviewDate from "$lib/components/ReviewDate.svelte";
    import Avatar from "$lib/components/Avatar.svelte";
    import AvatarImage from "$lib/components/AvatarImage.svelte";
    import AvatarText from "$lib/components/AvatarText.svelte";
    import Figure from "$lib/components/Figure.svelte";
    import Caption from "$lib/components/Caption.svelte";
    import Image from "$lib/components/Image.svelte";
    import Footnote from "$lib/components/Footnote.svelte";
    import Flair from "$lib/components/Flair.svelte";
    import Character from "$lib/components/Character.svelte";
    import CharacterCounter from "$lib/components/CharacterCounter.svelte";
    import Emoji from "$lib/components/Emoji.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import TourList from "$lib/components/TourList.svelte";
    import TourListItem from "$lib/components/TourListItem.svelte";
    import Tour from "$lib/components/Tour.svelte";
    import Timer from "$lib/components/Timer.svelte";
    import Separator from "$lib/components/Separator.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BackLink from "$lib/components/BackLink.svelte";

    let tourActive = $state(false);
    let noteText = $state("Patient presented with symptoms of...");
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Timeline & Cards</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <h2>Patient Timeline</h2>
    <TimelineList label="Patient care timeline">
        <TimelineListItem datetime="2026-03-01" heading="Initial Consultation">
            <p>
                Patient presented with recurring headaches. Referred for MRI
                scan.
            </p>
            <Badge type="info">Neurology</Badge>
        </TimelineListItem>
        <TimelineListItem datetime="2026-02-15" heading="Blood Test Results">
            <p>All results within normal range. No further action required.</p>
            <Badge type="success">Complete</Badge>
        </TimelineListItem>
        <TimelineListItem datetime="2026-02-01" heading="GP Registration">
            <p>
                Patient registered at practice. Initial health assessment
                completed.
            </p>
            <Badge>Administrative</Badge>
        </TimelineListItem>
        <TimelineListItem datetime="2026-01-15" heading="Referral Received">
            <p>Referral received from previous GP. Records transferred.</p>
            <Badge type="warning">Pending review</Badge>
        </TimelineListItem>
    </TimelineList>

    <Separator />

    <h2>Staff Cards</h2>
    <div
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--nhs-space-4);"
    >
        <Card heading="Dr. Sarah Chen" headingLevel={3}>
            <div
                style="display: flex; align-items: center; gap: var(--nhs-space-3); margin-bottom: var(--nhs-space-2);"
            >
                <Avatar label="Dr. Sarah Chen">
                    <AvatarText>SC</AvatarText>
                </Avatar>
                <div>
                    <p style="margin: 0; font-weight: 700;">
                        Consultant Neurologist
                    </p>
                    <p
                        style="margin: 0; font-size: var(--nhs-font-size-14); color: var(--nhs-dark-grey);"
                    >
                        Department of Neurology
                    </p>
                </div>
            </div>
            <Badge type="success">Available</Badge>
        </Card>

        <Card heading="Nurse James Patel" headingLevel={3}>
            <div
                style="display: flex; align-items: center; gap: var(--nhs-space-3); margin-bottom: var(--nhs-space-2);"
            >
                <Avatar label="Nurse James Patel">
                    <AvatarText>JP</AvatarText>
                </Avatar>
                <div>
                    <p style="margin: 0; font-weight: 700;">Senior Nurse</p>
                    <p
                        style="margin: 0; font-size: var(--nhs-font-size-14); color: var(--nhs-dark-grey);"
                    >
                        Ward A2
                    </p>
                </div>
            </div>
            <Badge type="warning">On call</Badge>
        </Card>

        <Card heading="Dr. Emily Watson" headingLevel={3}>
            <div
                style="display: flex; align-items: center; gap: var(--nhs-space-3); margin-bottom: var(--nhs-space-2);"
            >
                <Avatar label="Dr. Emily Watson">
                    <AvatarText>EW</AvatarText>
                </Avatar>
                <div>
                    <p style="margin: 0; font-weight: 700;">Registrar</p>
                    <p
                        style="margin: 0; font-size: var(--nhs-font-size-14); color: var(--nhs-dark-grey);"
                    >
                        General Surgery
                    </p>
                </div>
            </div>
            <Badge type="error">Unavailable</Badge>
        </Card>
    </div>

    <Separator />

    <h2>Date Range & Review</h2>
    <DateRange
        label="Reporting period"
        startLabel="From"
        endLabel="To"
        start="2026-01-01"
        end="2026-03-31"
    />
    <div style="margin-top: var(--nhs-space-3);">
        <ReviewDate>Page last reviewed: 1 March 2026</ReviewDate>
    </div>

    <Separator />

    <h2>Media & Figures</h2>
    <Figure label="Medical illustration">
        <div
            style="background: var(--nhs-pale-grey); height: 200px; display: flex; align-items: center; justify-content: center; border-radius: var(--nhs-border-radius);"
        >
            <p style="color: var(--nhs-mid-grey);">
                [Medical illustration placeholder]
            </p>
        </div>
        <Caption
            >Figure 1: Example medical illustration for educational purposes.</Caption
        >
    </Figure>

    <Separator />

    <h2>Text Elements</h2>
    <p>
        This section demonstrates inline text components:
        <Flair>highlighted text</Flair>, special characters like <Character
            >A</Character
        >, and emoji: <Emoji emoji="heart" label="heart" />
        <Emoji emoji="star" label="star" />
        <Emoji emoji="check" label="check mark" />.
    </p>

    <p>
        Icons: <Icon label="info"
            ><span style="font-weight: 700; color: var(--nhs-blue);">i</span
            ></Icon
        >
        <Icon label="warning"
            ><span style="font-weight: 700; color: var(--nhs-orange);">!</span
            ></Icon
        >
        <Icon label="success"
            ><span style="font-weight: 700; color: var(--nhs-green);"
                >&#10003;</span
            ></Icon
        >
    </p>

    <h3>Character Counter</h3>
    <div style="margin-bottom: var(--nhs-space-4);">
        <textarea
            class="text-area-input"
            aria-label="Clinical notes"
            bind:value={noteText}
            maxlength="200"
        ></textarea>
        <CharacterCounter>{noteText.length}/200 characters</CharacterCounter>
    </div>

    <Footnote>
        <sup>1</sup> All patient data shown is fictional and for demonstration purposes
        only.
    </Footnote>

    <Separator />

    <h2>Tour Guide</h2>
    <Tour label="Getting started tour" bind:active={tourActive}>
        <button class="button" onclick={() => (tourActive = !tourActive)}>
            {tourActive ? "End Tour" : "Start Tour"}
        </button>
        {#if tourActive}
            <TourList label="Onboarding steps">
                <TourListItem
                    label="Welcome"
                    current
                    stepNumber={1}
                    totalSteps={3}
                >
                    <p>
                        Welcome to the NHS Clinical Dashboard. Let us show you
                        around.
                    </p>
                </TourListItem>
                <TourListItem label="Navigation" stepNumber={2} totalSteps={3}>
                    <p>
                        Use the menu bar at the top to navigate between
                        sections.
                    </p>
                </TourListItem>
                <TourListItem label="Help" stepNumber={3} totalSteps={3}>
                    <p>Click the help icon at any time for assistance.</p>
                </TourListItem>
            </TourList>
        {/if}
    </Tour>

    <Separator />

    <h2>Timer</h2>
    <p>Consultation timer:</p>
    <Timer>15:00</Timer>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Timeline & Cards Example</p>
    </div>
</Footer>
