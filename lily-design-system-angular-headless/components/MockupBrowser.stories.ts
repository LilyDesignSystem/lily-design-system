import type { Meta, StoryObj } from "@storybook/angular";
import { MockupBrowser } from "./MockupBrowser";

const meta: Meta<MockupBrowser> = {
  title: "Headless/MockupBrowser",
  component: MockupBrowser,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<MockupBrowser>;

export const Default: Story = {};
