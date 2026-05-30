import type { Meta, StoryObj } from "@storybook/angular";
import { Panel } from "./Panel";

const meta: Meta<Panel> = {
  title: "Headless/Panel",
  component: Panel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Panel>;

export const Default: Story = {};
