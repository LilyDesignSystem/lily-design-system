import type { Meta, StoryObj } from "@storybook/angular";
import { PolskaPeselView } from "./PolskaPeselView";

const meta: Meta<PolskaPeselView> = {
  title: "Headless/PolskaPeselView",
  component: PolskaPeselView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PolskaPeselView>;

export const Default: Story = {};
