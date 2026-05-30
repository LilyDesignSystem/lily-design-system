import type { Meta, StoryObj } from "@storybook/angular";
import { ThemeProvider } from "./ThemeProvider";

const meta: Meta<ThemeProvider> = {
  title: "Headless/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemeProvider>;

export const Default: Story = {};
