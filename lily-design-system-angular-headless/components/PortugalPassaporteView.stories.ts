import type { Meta, StoryObj } from "@storybook/angular";
import { PortugalPassaporteView } from "./PortugalPassaporteView";

const meta: Meta<PortugalPassaporteView> = {
  title: "Headless/PortugalPassaporteView",
  component: PortugalPassaporteView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PortugalPassaporteView>;

export const Default: Story = {};
