import type { Meta, StoryObj } from "@storybook/angular";
import { AccordionNav } from "./AccordionNav";

const meta: Meta<AccordionNav> = {
  title: "Headless/AccordionNav",
  component: AccordionNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AccordionNav>;

export const Default: Story = {};
