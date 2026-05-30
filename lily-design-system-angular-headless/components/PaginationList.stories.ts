import type { Meta, StoryObj } from "@storybook/angular";
import { PaginationList } from "./PaginationList";

const meta: Meta<PaginationList> = {
  title: "Headless/PaginationList",
  component: PaginationList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PaginationList>;

export const Default: Story = {};
