import type { Meta, StoryObj } from "@storybook/angular";
import { BreadcrumbList } from "./BreadcrumbList";

const meta: Meta<BreadcrumbList> = {
  title: "Headless/BreadcrumbList",
  component: BreadcrumbList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BreadcrumbList>;

export const Default: Story = {};
