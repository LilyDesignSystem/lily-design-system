<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PilipinasPhilhealthIdentificationNumberView from "./PilipinasPhilhealthIdentificationNumberView.svelte";
    const { Story } = defineMeta({
        title: "Headless/PilipinasPhilhealthIdentificationNumberView",
        component: PilipinasPhilhealthIdentificationNumberView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <PilipinasPhilhealthIdentificationNumberView label="PilipinasPhilhealthIdentificationNumberView example">
        <span>PilipinasPhilhealthIdentificationNumberView example</span>
    </PilipinasPhilhealthIdentificationNumberView>
</Story>
