import type { Meta, StoryObj } from "@storybook/angular";
import { PaginationLink } from "./PaginationLink";

const meta: Meta<PaginationLink> = {
  title: "Headless/PaginationLink",
  component: PaginationLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PaginationLink>;

export const Default: Story = {};
