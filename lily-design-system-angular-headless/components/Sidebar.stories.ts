import type { Meta, StoryObj } from "@storybook/angular";
import { Sidebar } from "./Sidebar";

const meta: Meta<Sidebar> = {
  title: "Headless/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Sidebar>;

export const Default: Story = {};
