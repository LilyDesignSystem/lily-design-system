import type { Meta, StoryObj } from "@storybook/angular";
import { IbanInput } from "./IbanInput";

const meta: Meta<IbanInput> = {
    title: "Headless/IbanInput",
    component: IbanInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IbanInput>;

export const Default: Story = {};
