import type { Meta, StoryObj } from "@storybook/angular";
import { SlovenskoRodneCisloView } from "./SlovenskoRodneCisloView";

const meta: Meta<SlovenskoRodneCisloView> = {
  title: "Headless/SlovenskoRodneCisloView",
  component: SlovenskoRodneCisloView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlovenskoRodneCisloView>;

export const Default: Story = {};
