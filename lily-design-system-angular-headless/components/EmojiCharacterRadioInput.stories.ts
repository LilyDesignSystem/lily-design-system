import type { Meta, StoryObj } from "@storybook/angular";
import { EmojiCharacterRadioInput } from "./EmojiCharacterRadioInput";

const meta: Meta<EmojiCharacterRadioInput> = {
    title: "Headless/EmojiCharacterRadioInput",
    component: EmojiCharacterRadioInput,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EmojiCharacterRadioInput>;

export const Default: Story = {};
