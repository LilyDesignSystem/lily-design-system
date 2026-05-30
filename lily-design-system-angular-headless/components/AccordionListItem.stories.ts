import type { Meta, StoryObj } from "@storybook/angular";
import { AccordionListItem } from "./AccordionListItem";

const meta: Meta<AccordionListItem> = {
  title: "Headless/AccordionListItem",
  component: AccordionListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AccordionListItem>;

export const Default: Story = {};
