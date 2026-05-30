import type { Meta, StoryObj } from "@storybook/angular";
import { ItaliaCodiceFiscaleView } from "./ItaliaCodiceFiscaleView";

const meta: Meta<ItaliaCodiceFiscaleView> = {
  title: "Headless/ItaliaCodiceFiscaleView",
  component: ItaliaCodiceFiscaleView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ItaliaCodiceFiscaleView>;

export const Default: Story = {};
