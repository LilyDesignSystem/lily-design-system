import type { Meta, StoryObj } from "@storybook/angular";
import { LuxembourgMatriculeView } from "./LuxembourgMatriculeView";

const meta: Meta<LuxembourgMatriculeView> = {
  title: "Headless/LuxembourgMatriculeView",
  component: LuxembourgMatriculeView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LuxembourgMatriculeView>;

export const Default: Story = {};
