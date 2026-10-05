import type { Meta, StoryObj } from "@storybook/angular";
import { MultiSelectWithExtras } from "./MultiSelectWithExtras";

const meta: Meta<MultiSelectWithExtras> = {
  title: "Headless/MultiSelectWithExtras",
  component: MultiSelectWithExtras,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MultiSelectWithExtras>;

export const Default: Story = {
  args: { label: "Pick" },
};
