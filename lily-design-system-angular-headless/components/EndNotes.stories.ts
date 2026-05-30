import type { Meta, StoryObj } from "@storybook/angular";
import { EndNotes } from "./EndNotes";

const meta: Meta<EndNotes> = {
  title: "Headless/EndNotes",
  component: EndNotes,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EndNotes>;

export const Default: Story = {};
