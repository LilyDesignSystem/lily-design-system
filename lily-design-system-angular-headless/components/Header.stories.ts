import type { Meta, StoryObj } from "@storybook/angular";
import { Header } from "./Header";

const meta: Meta<Header> = {
  title: "Headless/Header",
  component: Header,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Header>;

export const Default: Story = {};
