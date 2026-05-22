import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ClipboardCopyButton from './ClipboardCopyButton';

const meta = {
  title: 'Examples/ClipboardCopyButton',
  component: ClipboardCopyButton,
  tags: ['autodocs']
} satisfies Meta<typeof ClipboardCopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
