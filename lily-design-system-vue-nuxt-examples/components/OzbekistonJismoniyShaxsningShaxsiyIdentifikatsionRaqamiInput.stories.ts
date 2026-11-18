import type { Meta, StoryObj } from "@storybook/vue3-vite";
import OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput.vue";

const meta = {
    title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
    component: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput,
    tags: ["autodocs"],
} satisfies Meta<typeof OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput" },
};
