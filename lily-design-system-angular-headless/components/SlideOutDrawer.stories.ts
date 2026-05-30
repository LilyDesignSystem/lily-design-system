import type { Meta, StoryObj } from "@storybook/angular";
import { SlideOutDrawer } from "./SlideOutDrawer";

const meta: Meta<SlideOutDrawer> = {
  title: "Headless/SlideOutDrawer",
  component: SlideOutDrawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlideOutDrawer>;

export const Default: Story = {};
