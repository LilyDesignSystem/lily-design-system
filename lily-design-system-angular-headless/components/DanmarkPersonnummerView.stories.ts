import type { Meta, StoryObj } from "@storybook/angular";
import { DanmarkPersonnummerView } from "./DanmarkPersonnummerView";

const meta: Meta<DanmarkPersonnummerView> = {
  title: "Headless/DanmarkPersonnummerView",
  component: DanmarkPersonnummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DanmarkPersonnummerView>;

export const Default: Story = {};
