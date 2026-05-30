import type { Meta, StoryObj } from "@storybook/angular";
import { SectionList } from "./SectionList";

const meta: Meta<SectionList> = {
  title: "Headless/SectionList",
  component: SectionList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SectionList>;

export const Default: Story = {};
