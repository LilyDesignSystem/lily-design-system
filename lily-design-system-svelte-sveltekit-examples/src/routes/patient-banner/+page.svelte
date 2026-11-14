<script lang="ts">
    // Patient banner: the composition in components/medical-banner/index.md (spec/healthcare-ui item 7, P27-T8). A labelled
    // <section> holding a dl of consumer-supplied items: two identifiers (name and date of birth, then the NHS number), age,
    // gender and allergies through AllergyList, so the allergy status is never blank. A deceased patient's banner carries
    // data-deceased and says so in words, not by colour alone. A missing value is the consumer's words ("Not known"), never a
    // dash. Nothing is truncated: e2e/patient-banner.spec.ts checks every field at 320px.
    import Header from "#lib/components/Header/Header.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";
    import AgeView from "#lib/components/AgeView/AgeView.svelte";
    import AllergyList from "#lib/components/AllergyList/AllergyList.svelte";
    import AllergyListItem from "#lib/components/AllergyListItem/AllergyListItem.svelte";
    import EnglandNationalHealthServiceNumberView from "#lib/components/EnglandNationalHealthServiceNumberView/EnglandNationalHealthServiceNumberView.svelte";
    import { ageParts, toIsoDuration } from "#lib/components/clinical-format";

    // Demo content in English through the same props a consumer would translate. The age words come from Intl where the
    // browser has Intl.DurationFormat, and from the numbers alone otherwise; Lily writes no unit words.
    const today = "2026-11-14";
    function ageWords(birth: string, at: string) {
        const parts = ageParts(birth, at);
        const duration = Object.fromEntries(parts.map((p) => [p.unit, p.value]));
        const DurationFormat = (
            Intl as unknown as {
                DurationFormat?: new (l: string, o: object) => { format(d: object): string };
            }
        ).DurationFormat;
        const value = DurationFormat
            ? new DurationFormat("en-GB", { style: "long" }).format(duration)
            : parts.map((p) => `${p.value} ${p.unit}`).join(" ");
        return { value, duration: toIsoDuration(parts) };
    }
    const living = ageWords("1949-02-03", today);
    const infant = ageWords("2026-08-01", today);
</script>

<svelte:head>
    <title>Patient banner — Lily Design System</title>
</svelte:head>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Patient banner</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    <p>
        A patient banner confirms that the record on screen is the right person's. It shows two
        identifiers, never truncates a field, and says when something is not known.
    </p>

    <section
        class="patient-banner"
        aria-label="Patient details: MONTGOMERY-FITZWILLIAM, Alexandra"
    >
        <dl>
            <div>
                <dt>Name</dt>
                <dd>MONTGOMERY-FITZWILLIAM, Alexandra Bartholomew-Josephine (Dr)</dd>
            </div>
            <div>
                <dt>Born</dt>
                <dd>
                    <time datetime="1949-02-03">3 Feb 1949</time>
                    (<AgeView
                        value={living.value}
                        duration={living.duration}
                    />)
                </dd>
            </div>
            <div>
                <dt>NHS No.</dt>
                <dd><EnglandNationalHealthServiceNumberView value="943 476 5919" /></dd>
            </div>
            <div>
                <dt>Gender</dt>
                <dd>Female</dd>
            </div>
            <div>
                <dt>Allergies</dt>
                <dd>
                    <AllergyList
                        status="known"
                        statusLabel="Known allergies"
                    >
                        <AllergyListItem
                            substance="Penicillin and other beta-lactam antibiotics"
                            reaction="Anaphylaxis"
                            severity="severe"
                            severityLabel="Severe"
                            updated="2026-11-03"
                            updatedLabel="Updated 3 Nov 2026"
                        />
                        <AllergyListItem
                            substance="Non-steroidal anti-inflammatory drugs"
                            reaction="Bronchospasm"
                            severity="moderate"
                            severityLabel="Moderate"
                        />
                        <AllergyListItem
                            substance="Latex"
                            reaction="Contact dermatitis"
                            severity="mild"
                            severityLabel="Mild"
                        />
                        <AllergyListItem
                            substance="Chlorhexidine gluconate skin preparations"
                            reaction="Urticaria"
                            severity="moderate"
                            severityLabel="Moderate"
                        />
                    </AllergyList>
                </dd>
            </div>
        </dl>
    </section>

    <section
        class="patient-banner"
        aria-label="Patient details: NOAH, Baby"
        data-deceased="true"
    >
        <p class="patient-banner-deceased">Deceased</p>
        <dl>
            <div>
                <dt>Name</dt>
                <dd>NOAH, Baby</dd>
            </div>
            <div>
                <dt>Born</dt>
                <dd><time datetime="2026-08-01">1 Aug 2026</time></dd>
            </div>
            <div>
                <dt>Died</dt>
                <dd><time datetime="2026-11-14">14 Nov 2026</time></dd>
            </div>
            <div>
                <dt>Age at death</dt>
                <dd>
                    <AgeView
                        value={infant.value}
                        duration={infant.duration}
                    />
                </dd>
            </div>
            <div>
                <dt>NHS No.</dt>
                <dd>Not known</dd>
            </div>
            <div>
                <dt>Allergies</dt>
                <dd>
                    <AllergyList
                        status="not-recorded"
                        statusLabel="Allergies not recorded"
                    />
                </dd>
            </div>
        </dl>
    </section>
</main>
