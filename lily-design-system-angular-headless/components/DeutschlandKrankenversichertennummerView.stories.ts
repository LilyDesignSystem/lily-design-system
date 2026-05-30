import type { Meta, StoryObj } from "@storybook/angular";
import { DeutschlandKrankenversichertennummerView } from "./DeutschlandKrankenversichertennummerView";

const meta: Meta<DeutschlandKrankenversichertennummerView> = {
  title: "Headless/DeutschlandKrankenversichertennummerView",
  component: DeutschlandKrankenversichertennummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DeutschlandKrankenversichertennummerView>;

export const Default: Story = {};
