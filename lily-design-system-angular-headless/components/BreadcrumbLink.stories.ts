import type { Meta, StoryObj } from "@storybook/angular";
import { BreadcrumbLink } from "./BreadcrumbLink";

const meta: Meta<BreadcrumbLink> = {
  title: "Headless/BreadcrumbLink",
  component: BreadcrumbLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BreadcrumbLink>;

export const Default: Story = {};
