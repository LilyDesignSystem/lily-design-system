import type { Meta, StoryObj } from "@storybook/angular";
import { AccordionCheckbox } from "./AccordionCheckbox";

const meta: Meta<AccordionCheckbox> = {
  title: "Headless/AccordionCheckbox",
  component: AccordionCheckbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AccordionCheckbox>;

export const Default: Story = {};
