import type { Meta, StoryObj } from '@storybook/react-vite';
import ClipboardCopyButton from './ClipboardCopyButton';

const meta = {
  title: 'Headless/ClipboardCopyButton',
  component: ClipboardCopyButton,
  tags: ['autodocs']
} satisfies Meta<typeof ClipboardCopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
