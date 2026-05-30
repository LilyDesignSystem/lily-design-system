import type { Meta, StoryObj } from "@storybook/angular";
import { Draft } from "./Draft";

const meta: Meta<Draft> = {
  title: "Headless/Draft",
  component: Draft,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Draft>;

export const Default: Story = {};
