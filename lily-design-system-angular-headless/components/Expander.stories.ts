import type { Meta, StoryObj } from "@storybook/angular";
import { Expander } from "./Expander";

const meta: Meta<Expander> = {
  title: "Headless/Expander",
  component: Expander,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Expander>;

export const Default: Story = {};
