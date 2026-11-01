import type { Meta, StoryObj } from "@storybook/angular";
import { AustraliaTaxFileNumberView } from "./AustraliaTaxFileNumberView";

const meta: Meta<AustraliaTaxFileNumberView> = {
    title: "Headless/AustraliaTaxFileNumberView",
    component: AustraliaTaxFileNumberView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AustraliaTaxFileNumberView>;

export const Default: Story = {};
