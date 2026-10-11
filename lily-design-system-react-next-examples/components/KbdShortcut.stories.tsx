import type { Meta, StoryObj } from '@storybook/react-vite';
import KbdShortcut from './KbdShortcut';

const meta = {
  title: 'Headless/KbdShortcut',
  component: KbdShortcut,
  tags: ['autodocs']
} satisfies Meta<typeof KbdShortcut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { keys: ["Ctrl", "K"] }
};
