import type { Meta, StoryObj } from "@storybook/angular";
import { OsterreichSozialversicherungsnummerView } from "./OsterreichSozialversicherungsnummerView";

const meta: Meta<OsterreichSozialversicherungsnummerView> = {
  title: "Headless/OsterreichSozialversicherungsnummerView",
  component: OsterreichSozialversicherungsnummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<OsterreichSozialversicherungsnummerView>;

export const Default: Story = {};
