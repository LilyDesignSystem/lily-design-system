import type { Meta, StoryObj } from "@storybook/angular";
import { SverigePersonnummerView } from "./SverigePersonnummerView";

const meta: Meta<SverigePersonnummerView> = {
  title: "Headless/SverigePersonnummerView",
  component: SverigePersonnummerView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SverigePersonnummerView>;

export const Default: Story = {};
