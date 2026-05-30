import type { Meta, StoryObj } from "@storybook/angular";
import { BreadcrumbNav } from "./BreadcrumbNav";

const meta: Meta<BreadcrumbNav> = {
  title: "Headless/BreadcrumbNav",
  component: BreadcrumbNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BreadcrumbNav>;

export const Default: Story = {};
