import type { Meta, StoryObj } from "@storybook/angular";
import { Tour } from "./Tour";

const meta: Meta<Tour> = {
  title: "Headless/Tour",
  component: Tour,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Tour>;

export const Default: Story = {};
