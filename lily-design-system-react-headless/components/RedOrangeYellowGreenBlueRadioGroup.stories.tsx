import type { Meta, StoryObj } from "@storybook/react-vite";
import RedOrangeYellowGreenBlueRadioGroup from "./RedOrangeYellowGreenBlueRadioGroup";

const meta = {
    title: "Headless/RedOrangeYellowGreenBlueRadioGroup",
    component: RedOrangeYellowGreenBlueRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof RedOrangeYellowGreenBlueRadioGroup>;

export default meta;
type Story = StoryObj<typeof RedOrangeYellowGreenBlueRadioGroup>;

export const Default: Story = {};
