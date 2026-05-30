import type { Meta, StoryObj } from "@storybook/angular";
import { LietuvaPasasView } from "./LietuvaPasasView";

const meta: Meta<LietuvaPasasView> = {
  title: "Headless/LietuvaPasasView",
  component: LietuvaPasasView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LietuvaPasasView>;

export const Default: Story = {};
