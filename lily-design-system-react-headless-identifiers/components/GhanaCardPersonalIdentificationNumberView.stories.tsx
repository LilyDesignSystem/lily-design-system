import type { Meta, StoryObj } from "@storybook/react-vite";
import GhanaCardPersonalIdentificationNumberView from "./GhanaCardPersonalIdentificationNumberView";

const meta = {
    title: "Headless/GhanaCardPersonalIdentificationNumberView",
    component: GhanaCardPersonalIdentificationNumberView,
    tags: ["autodocs"],
} satisfies Meta<typeof GhanaCardPersonalIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "GhanaCardPersonalIdentificationNumberView" },
};
