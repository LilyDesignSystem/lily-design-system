import type { Meta, StoryObj } from "@storybook/angular";
import { Details } from "./Details";

const meta: Meta<Details> = {
  title: "Headless/Details",
  component: Details,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Details>;

export const Default: Story = {};
