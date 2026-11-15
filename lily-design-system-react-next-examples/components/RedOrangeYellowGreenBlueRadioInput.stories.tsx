import type { Meta, StoryObj } from "@storybook/react-vite";
import RedOrangeYellowGreenBlueRadioInput from "./RedOrangeYellowGreenBlueRadioInput";

const meta = {
    title: "Headless/RedOrangeYellowGreenBlueRadioInput",
    component: RedOrangeYellowGreenBlueRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof RedOrangeYellowGreenBlueRadioInput>;

export default meta;
type Story = StoryObj<typeof RedOrangeYellowGreenBlueRadioInput>;

export const Default: Story = {};
