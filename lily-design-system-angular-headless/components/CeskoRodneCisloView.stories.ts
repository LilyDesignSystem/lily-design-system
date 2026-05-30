import type { Meta, StoryObj } from "@storybook/angular";
import { CeskoRodneCisloView } from "./CeskoRodneCisloView";

const meta: Meta<CeskoRodneCisloView> = {
  title: "Headless/CeskoRodneCisloView",
  component: CeskoRodneCisloView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CeskoRodneCisloView>;

export const Default: Story = {};
