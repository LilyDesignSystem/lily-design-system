import type { Meta, StoryObj } from "@storybook/angular";
import { ThemeView } from "./ThemeView";

const meta: Meta<ThemeView> = {
  title: "Headless/ThemeView",
  component: ThemeView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemeView>;

export const Default: Story = {};
