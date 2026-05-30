import type { Meta, StoryObj } from "@storybook/angular";
import { NorgeFodselsnummerView } from "./NorgeFodselsnummerView";

const meta: Meta<NorgeFodselsnummerView> = {
  title: "Headless/NorgeFodselsnummerView",
  component: NorgeFodselsnummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NorgeFodselsnummerView>;

export const Default: Story = {};
