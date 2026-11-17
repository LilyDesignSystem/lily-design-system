import type { Meta, StoryObj } from "@storybook/react-vite";
import DurationView from "./DurationView";

const meta = {
    title: "Headless/DurationView",
    component: DurationView,
    tags: ["autodocs"],
} satisfies Meta<typeof DurationView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { value: "3 days 4 hours", duration: "P3DT4H", label: "Length of stay" },
};

export const Negative: Story = { args: { value: "3 days early", duration: "-P3D" } };
