import type { Meta, StoryObj } from "@storybook/angular";
import { Dial } from "./Dial";

const meta: Meta<Dial> = {
  title: "Headless/Dial",
  component: Dial,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Dial>;

export const Default: Story = {};
