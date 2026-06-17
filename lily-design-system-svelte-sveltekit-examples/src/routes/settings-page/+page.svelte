<script lang="ts">
    import SwitchButton from "$lib/components/SwitchButton/SwitchButton.svelte";
    import RadioGroup from "$lib/components/RadioGroup/RadioGroup.svelte";
    import RadioInput from "$lib/components/RadioInput/RadioInput.svelte";
    import Select from "$lib/components/Select/Select.svelte";
    import Option from "$lib/components/Option/Option.svelte";
    import Fieldset from "$lib/components/Fieldset/Fieldset.svelte";
    import Banner from "$lib/components/Banner/Banner.svelte";
    import ThemeSelect from "$lib/components/ThemeSelect/ThemeSelect.svelte";
    import ThemeSelect from "$lib/components/ThemeSelect/ThemeSelect.svelte";
    import ThemeSelectOption from "$lib/components/ThemeSelectOption/ThemeSelectOption.svelte";
    import ThemeView from "$lib/components/ThemeView/ThemeView.svelte";
    import CheckboxInput from "$lib/components/CheckboxInput/CheckboxInput.svelte";
    import NumberInput from "$lib/components/NumberInput/NumberInput.svelte";
    import ColorInput from "$lib/components/ColorInput/ColorInput.svelte";
    import RangeInput from "$lib/components/RangeInput/RangeInput.svelte";
    import Slider from "$lib/components/Slider/Slider.svelte";
    import SegmentGroup from "$lib/components/SegmentGroup/SegmentGroup.svelte";
    import SegmentGroupItem from "$lib/components/SegmentGroupItem/SegmentGroupItem.svelte";
    import Form from "$lib/components/Form/Form.svelte";
    import Field from "$lib/components/Field/Field.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import Separator from "$lib/components/Separator/Separator.svelte";
    import Header from "$lib/components/Header/Header.svelte";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import BackLink from "$lib/components/BackLink/BackLink.svelte";

    let notifications = $state(true);
    let darkMode = $state(false);
    let autoSave = $state(true);
    let emailDigest = $state(false);
    let language = $state("en");
    let theme = $state("light");
    let accentColor = $state("#005eb8");
    let fontSize = $state(16);
    let volume = $state(75);
    let saved = $state(false);

    function handleSave() {
        saved = true;
        setTimeout(() => (saved = false), 3000);
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Settings</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    {#if saved}
        <Banner type="success" dismissible onclose={() => (saved = false)}>
            Settings saved successfully.
        </Banner>
    {/if}

    <Form label="Settings form" onsubmit={handleSave}>
        <h2>Notifications</h2>
        <div
            style="display: flex; flex-direction: column; gap: var(--nhs-space-3); margin-bottom: var(--nhs-space-4);"
        >
            <div
                style="display: flex; align-items: center; justify-content: space-between; max-width: 400px;"
            >
                <span>Push notifications</span>
                <SwitchButton
                    label="Push notifications"
                    bind:checked={notifications}
                />
            </div>
            <div
                style="display: flex; align-items: center; justify-content: space-between; max-width: 400px;"
            >
                <span>Dark mode</span>
                <SwitchButton label="Dark mode" bind:checked={darkMode} />
            </div>
            <div
                style="display: flex; align-items: center; justify-content: space-between; max-width: 400px;"
            >
                <span>Auto-save</span>
                <SwitchButton label="Auto-save" bind:checked={autoSave} />
            </div>
            <label
                style="display: flex; align-items: center; gap: var(--nhs-space-2);"
            >
                <CheckboxInput
                    label="Email digest"
                    bind:checked={emailDigest}
                />
                Receive weekly email digest
            </label>
        </div>

        <Separator />

        <h2>Language & Region</h2>
        <Field label="Language">
            <Select label="Language" bind:value={language}>
                <Option value="en">English</Option>
                <Option value="cy">Cymraeg (Welsh)</Option>
                <Option value="gd">Gaidhlig (Scottish Gaelic)</Option>
            </Select>
        </Field>

        <Separator />

        <h2>Theme</h2>

        <Field label="Theme selection">
            <ThemeSelect label="Choose a theme" bind:value={theme}>
                <ThemeSelectOption value="light">Light</ThemeSelectOption>
                <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
                <ThemeSelectOption value="auto"
                    >System default</ThemeSelectOption
                >
            </ThemeSelect>
        </Field>

        <ThemeView label="Current theme" value={theme} />

        <div style="margin-top: var(--nhs-space-3);">
            <Field label="Accent colour">
                <ColorInput label="Accent colour" bind:value={accentColor} />
            </Field>
            <p>
                Selected: <span style="color: {accentColor}; font-weight: 700;"
                    >{accentColor}</span
                >
            </p>
        </div>

        <Separator />

        <h2>Display</h2>

        <Field label="Font size">
            <NumberInput
                label="Font size in pixels"
                bind:value={fontSize}
                min={12}
                max={24}
                step={1}
            />
        </Field>

        <Field label="Volume">
            <RangeInput
                label="Notification volume"
                bind:value={volume}
                min={0}
                max={100}
            />
            <p>{volume}%</p>
        </Field>

        <Field label="Zoom level">
            <Slider
                label="Zoom level"
                value={100}
                min={50}
                max={200}
                step={25}
            />
        </Field>

        <Separator />

        <h2>View Mode</h2>
        <SegmentGroup label="View mode">
            <SegmentGroupItem value="list" checked>List</SegmentGroupItem>
            <SegmentGroupItem value="grid">Grid</SegmentGroupItem>
            <SegmentGroupItem value="compact">Compact</SegmentGroupItem>
        </SegmentGroup>

        <div style="margin-top: var(--nhs-space-5);">
            <Button type="submit">Save Settings</Button>
        </div>
    </Form>
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Settings Page Example</p>
    </div>
</Footer>
