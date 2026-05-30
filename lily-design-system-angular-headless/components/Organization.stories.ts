import type { Meta, StoryObj } from "@storybook/angular";
import { Organization } from "./Organization";

const meta: Meta<Organization> = {
  title: "Headless/Organization",
  component: Organization,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Organization>;

export const Default: Story = {};
