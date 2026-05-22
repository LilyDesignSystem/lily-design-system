import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ClipboardCopyButton from './ClipboardCopyButton.vue';

const meta = {
  title: 'Examples/ClipboardCopyButton',
  component: ClipboardCopyButton,
  tags: ['autodocs']
} satisfies Meta<typeof ClipboardCopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
