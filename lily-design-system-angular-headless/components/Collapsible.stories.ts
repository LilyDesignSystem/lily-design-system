import type { Meta, StoryObj } from "@storybook/angular";
import { Collapsible } from "./Collapsible";

const meta: Meta<Collapsible> = {
  title: "Headless/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Collapsible>;

export const Default: Story = {};
