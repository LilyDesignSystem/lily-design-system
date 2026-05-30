import type { Meta, StoryObj } from "@storybook/angular";
import { DoList } from "./DoList";

const meta: Meta<DoList> = {
  title: "Headless/DoList",
  component: DoList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DoList>;

export const Default: Story = {};
