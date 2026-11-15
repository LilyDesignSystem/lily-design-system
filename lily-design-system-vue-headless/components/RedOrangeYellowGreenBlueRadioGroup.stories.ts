import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RedOrangeYellowGreenBlueRadioGroup from "./RedOrangeYellowGreenBlueRadioGroup.vue";

const meta = {
    title: "Headless/RedOrangeYellowGreenBlueRadioGroup",
    component: RedOrangeYellowGreenBlueRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof RedOrangeYellowGreenBlueRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
