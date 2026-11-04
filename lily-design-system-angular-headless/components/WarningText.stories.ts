import type { Meta, StoryObj } from "@storybook/angular";
import { WarningText } from "./WarningText";

const meta: Meta<WarningText> = {
    title: "Headless/WarningText",
    component: WarningText,
    tags: ["autodocs"],
    render: () => ({
        template: `<lily-warning-text><span icon>!</span><span class="screen-reader-span">Warning</span> You can be fined up to £5,000 if you do not register.</lily-warning-text>`,
    }),
};

export default meta;
type Story = StoryObj<WarningText>;

export const Default: Story = {};
