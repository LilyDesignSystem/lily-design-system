import type { Meta, StoryObj } from "@storybook/angular";
import { SchweizAhvNummerView } from "./SchweizAhvNummerView";

const meta: Meta<SchweizAhvNummerView> = {
  title: "Headless/SchweizAhvNummerView",
  component: SchweizAhvNummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SchweizAhvNummerView>;

export const Default: Story = {};
