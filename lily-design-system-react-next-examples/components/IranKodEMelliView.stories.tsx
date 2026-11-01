import type { Meta, StoryObj } from "@storybook/react-vite";
import IranKodEMelliView from "./IranKodEMelliView";

const meta = {
    title: "Headless/IranKodEMelliView",
    component: IranKodEMelliView,
    tags: ["autodocs"],
} satisfies Meta<typeof IranKodEMelliView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "IranKodEMelliView" },
};
