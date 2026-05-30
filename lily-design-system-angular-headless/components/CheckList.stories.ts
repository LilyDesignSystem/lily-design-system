import type { Meta, StoryObj } from "@storybook/angular";
import { CheckList } from "./CheckList";

const meta: Meta<CheckList> = {
  title: "Headless/CheckList",
  component: CheckList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CheckList>;

export const Default: Story = {};
