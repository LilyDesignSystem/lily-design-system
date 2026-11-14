import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset class="body-map"><legend class="body-map-legend">Where is the pain?</legend><div class="body-map-figure" aria-hidden="true"><svg viewBox="0 0 40 80" width="80" height="160"><circle data-region="head" cx="20" cy="8" r="7"></circle><rect data-region="chest" x="10" y="17" width="20" height="22"></rect></svg></div><ul class="body-map-regions"><li><label class="body-map-region"><input type="checkbox" name="sites" value="head"> Head</label></li><li><label class="body-map-region"><input type="checkbox" name="sites" value="chest"> Chest</label></li></ul></fieldset>`;

const meta = {
    title: "Headless/BodyMap",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
