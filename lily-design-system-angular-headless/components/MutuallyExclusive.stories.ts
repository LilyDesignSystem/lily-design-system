import type { Meta, StoryObj } from "@storybook/angular";
import { MutuallyExclusive } from "./MutuallyExclusive";

const meta: Meta<MutuallyExclusive> = {
  title: "Headless/MutuallyExclusive",
  component: MutuallyExclusive,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MutuallyExclusive>;

export const Default: Story = {};
