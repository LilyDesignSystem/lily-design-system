import type { Meta, StoryObj } from "@storybook/angular";
import { TransferList } from "./TransferList";

const meta: Meta<TransferList> = {
    title: "Headless/TransferList",
    component: TransferList,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TransferList>;

export const Default: Story = {
    render: () => ({
        moduleMetadata: { imports: [TransferList] },
        template: `<lily-transfer-list label="Team members" sourceLabel="Available" targetLabel="Selected"><ul source role="listbox" aria-label="Available people"><li role="option">Ada</li></ul><button actions type="button">Add</button><ul target role="listbox" aria-label="Selected people"><li role="option">Grace</li></ul></lily-transfer-list>`,
    }),
};
