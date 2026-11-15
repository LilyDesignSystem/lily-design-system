import type { Meta, StoryObj } from "@storybook/react-vite";
import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput";

const meta = {
    title: "Headless/RedAmberGreenRadioInput",
    component: RedAmberGreenRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof RedAmberGreenRadioInput>;

export default meta;
type Story = StoryObj<typeof RedAmberGreenRadioInput>;

export const Default: Story = {};
