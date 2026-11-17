import type { Meta, StoryObj } from "@storybook/angular";
import { DurationView } from "./DurationView";

const meta: Meta<DurationView> = {
    title: "Headless/DurationView",
    component: DurationView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DurationView>;

export const Default: Story = {
    args: { value: "3 days 4 hours", duration: "P3DT4H", label: "Length of stay" },
};

export const Negative: Story = { args: { value: "3 days early", duration: "-P3D" } };
