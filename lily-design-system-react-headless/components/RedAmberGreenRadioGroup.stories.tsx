import type { Meta, StoryObj } from "@storybook/react-vite";
import RedAmberGreenRadioGroup from "./RedAmberGreenRadioGroup";

const meta = {
    title: "Headless/RedAmberGreenRadioGroup",
    component: RedAmberGreenRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof RedAmberGreenRadioGroup>;

export default meta;
type Story = StoryObj<typeof RedAmberGreenRadioGroup>;

export const Default: Story = {};
