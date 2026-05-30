import type { Meta, StoryObj } from "@storybook/angular";
import { LatvijaPersonasKodsInput } from "./LatvijaPersonasKodsInput";

const meta: Meta<LatvijaPersonasKodsInput> = {
  title: "Headless/LatvijaPersonasKodsInput",
  component: LatvijaPersonasKodsInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LatvijaPersonasKodsInput>;

export const Default: Story = {};
