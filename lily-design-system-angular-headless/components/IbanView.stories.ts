import type { Meta, StoryObj } from "@storybook/angular";
import { IbanView } from "./IbanView";

const meta: Meta<IbanView> = {
    title: "Headless/IbanView",
    component: IbanView,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IbanView>;

export const Default: Story = {};
