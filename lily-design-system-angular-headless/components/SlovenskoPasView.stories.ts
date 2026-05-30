import type { Meta, StoryObj } from "@storybook/angular";
import { SlovenskoPasView } from "./SlovenskoPasView";

const meta: Meta<SlovenskoPasView> = {
  title: "Headless/SlovenskoPasView",
  component: SlovenskoPasView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SlovenskoPasView>;

export const Default: Story = {};
