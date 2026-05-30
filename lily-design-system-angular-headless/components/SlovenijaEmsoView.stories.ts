import type { Meta, StoryObj } from "@storybook/angular";
import { SlovenijaEmsoView } from "./SlovenijaEmsoView";

const meta: Meta<SlovenijaEmsoView> = {
  title: "Headless/SlovenijaEmsoView",
  component: SlovenijaEmsoView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlovenijaEmsoView>;

export const Default: Story = {};
