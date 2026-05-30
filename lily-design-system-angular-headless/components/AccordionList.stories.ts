import type { Meta, StoryObj } from "@storybook/angular";
import { AccordionList } from "./AccordionList";

const meta: Meta<AccordionList> = {
  title: "Headless/AccordionList",
  component: AccordionList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AccordionList>;

export const Default: Story = {};
