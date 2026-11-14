import type { Meta, StoryObj } from "@storybook/angular";
import { AgeView } from "./AgeView";

const meta: Meta<AgeView> = {
    title: "Headless/AgeView",
    component: AgeView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AgeView>;

export const Default: Story = { args: { label: "Age", value: "3 weeks 2 days", duration: "P23D" } };
