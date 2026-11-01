import type { Meta, StoryObj } from "@storybook/vue3-vite";
import WarningText from "./WarningText.vue";

const meta = {
    title: "Headless/WarningText",
    component: WarningText,
    tags: ["autodocs"],
} satisfies Meta<typeof WarningText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => ({
        components: { WarningText },
        template:
            '<WarningText><template #icon>!</template><span class="visually-hidden">Warning</span> You can be fined up to £5,000 if you do not register.</WarningText>',
    }),
};
