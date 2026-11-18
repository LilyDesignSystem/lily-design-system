import type { Meta, StoryObj } from "@storybook/react-vite";
import OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput";

const meta = {
    title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
    component: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput,
    tags: ["autodocs"],
} satisfies Meta<typeof OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput" },
};
