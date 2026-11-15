import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RedOrangeYellowGreenBlueRadioInput from "./RedOrangeYellowGreenBlueRadioInput.vue";

const meta = {
    title: "Headless/RedOrangeYellowGreenBlueRadioInput",
    component: RedOrangeYellowGreenBlueRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof RedOrangeYellowGreenBlueRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
