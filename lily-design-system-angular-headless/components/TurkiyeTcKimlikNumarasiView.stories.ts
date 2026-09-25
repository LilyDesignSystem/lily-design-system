import type { Meta, StoryObj } from "@storybook/angular";
import { TurkiyeTcKimlikNumarasiView } from "./TurkiyeTcKimlikNumarasiView";

const meta: Meta<TurkiyeTcKimlikNumarasiView> = {
  title: "Headless/TurkiyeTcKimlikNumarasiView",
  component: TurkiyeTcKimlikNumarasiView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TurkiyeTcKimlikNumarasiView>;

export const Default: Story = {};
