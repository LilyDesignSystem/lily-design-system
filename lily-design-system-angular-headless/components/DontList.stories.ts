import type { Meta, StoryObj } from "@storybook/angular";
import { DontList } from "./DontList";

const meta: Meta<DontList> = {
  title: "Headless/DontList",
  component: DontList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DontList>;

export const Default: Story = {};
