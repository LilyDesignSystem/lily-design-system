import type { Meta, StoryObj } from "@storybook/angular";
import { SverigePersonnummerInput } from "./SverigePersonnummerInput";

const meta: Meta<SverigePersonnummerInput> = {
  title: "Headless/SverigePersonnummerInput",
  component: SverigePersonnummerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SverigePersonnummerInput>;

export const Default: Story = {};
