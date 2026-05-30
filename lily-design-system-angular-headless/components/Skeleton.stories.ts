import type { Meta, StoryObj } from "@storybook/angular";
import { Skeleton } from "./Skeleton";

const meta: Meta<Skeleton> = {
  title: "Headless/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Skeleton>;

export const Default: Story = {};
