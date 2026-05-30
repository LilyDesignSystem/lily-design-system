import type { Meta, StoryObj } from "@storybook/angular";
import { PaginationNav } from "./PaginationNav";

const meta: Meta<PaginationNav> = {
  title: "Headless/PaginationNav",
  component: PaginationNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PaginationNav>;

export const Default: Story = {};
