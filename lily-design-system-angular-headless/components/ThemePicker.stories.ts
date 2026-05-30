import type { Meta, StoryObj } from "@storybook/angular";
import { ThemePicker } from "./ThemePicker";

const meta: Meta<ThemePicker> = {
  title: "Headless/ThemePicker",
  component: ThemePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemePicker>;

export const Default: Story = {};
