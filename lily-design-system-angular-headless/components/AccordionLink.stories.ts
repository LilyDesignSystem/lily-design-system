import type { Meta, StoryObj } from "@storybook/angular";
import { AccordionLink } from "./AccordionLink";

const meta: Meta<AccordionLink> = {
  title: "Headless/AccordionLink",
  component: AccordionLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AccordionLink>;

export const Default: Story = {};
