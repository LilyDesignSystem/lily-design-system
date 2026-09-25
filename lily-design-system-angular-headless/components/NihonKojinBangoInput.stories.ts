import type { Meta, StoryObj } from "@storybook/angular";
import { NihonKojinBangoInput } from "./NihonKojinBangoInput";

const meta: Meta<NihonKojinBangoInput> = {
  title: "Headless/NihonKojinBangoInput",
  component: NihonKojinBangoInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NihonKojinBangoInput>;

export const Default: Story = {};
