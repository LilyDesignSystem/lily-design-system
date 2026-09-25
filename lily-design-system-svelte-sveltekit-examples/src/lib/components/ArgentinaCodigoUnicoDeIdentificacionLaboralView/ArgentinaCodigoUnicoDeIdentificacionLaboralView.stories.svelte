<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ArgentinaCodigoUnicoDeIdentificacionLaboralView from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.svelte";
    const { Story } = defineMeta({
        title: "Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralView",
        component: ArgentinaCodigoUnicoDeIdentificacionLaboralView,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ArgentinaCodigoUnicoDeIdentificacionLaboralView label="ArgentinaCodigoUnicoDeIdentificacionLaboralView example">
        <span>ArgentinaCodigoUnicoDeIdentificacionLaboralView example</span>
    </ArgentinaCodigoUnicoDeIdentificacionLaboralView>
</Story>
