import type { Meta, StoryObj } from "@storybook/angular";
import { AotearoaNationalHealthIndexView } from "./AotearoaNationalHealthIndexView";

const meta: Meta<AotearoaNationalHealthIndexView> = {
  title: "Headless/AotearoaNationalHealthIndexView",
  component: AotearoaNationalHealthIndexView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AotearoaNationalHealthIndexView>;

export const Default: Story = {};
