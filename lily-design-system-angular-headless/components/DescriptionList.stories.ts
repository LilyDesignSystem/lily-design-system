import type { Meta, StoryObj } from "@storybook/angular";
import { DescriptionList } from "./DescriptionList";

const meta: Meta<DescriptionList> = {
  title: "Headless/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DescriptionList>;

export const Default: Story = {};
