import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KbdShortcut from './KbdShortcut.vue';

const meta = {
  title: 'Headless/KbdShortcut',
  component: KbdShortcut,
  tags: ['autodocs']
} satisfies Meta<typeof KbdShortcut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { keys: ['Ctrl', 'K'] },
};
