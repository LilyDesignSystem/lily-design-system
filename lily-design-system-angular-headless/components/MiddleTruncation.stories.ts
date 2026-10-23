import type { Meta, StoryObj } from "@storybook/angular";
import { MiddleTruncation } from "./MiddleTruncation";

const meta: Meta<MiddleTruncation> = {
  title: "Headless/MiddleTruncation",
  component: MiddleTruncation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MiddleTruncation>;

export const Default: Story = { args: { text: "quarterly-report-final-version-3.pdf", ellipsis: "…", strategy: "min-end", end: 6 } };
