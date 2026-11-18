import type { Meta, StoryObj } from "@storybook/vue3-vite";
import OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView.vue";

const meta = {
    title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView",
    component: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView,
    tags: ["autodocs"],
} satisfies Meta<typeof OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView" },
};
