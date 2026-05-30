import type { Meta, StoryObj } from "@storybook/angular";
import { BreadcrumbListItem } from "./BreadcrumbListItem";

const meta: Meta<BreadcrumbListItem> = {
  title: "Headless/BreadcrumbListItem",
  component: BreadcrumbListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BreadcrumbListItem>;

export const Default: Story = {};
