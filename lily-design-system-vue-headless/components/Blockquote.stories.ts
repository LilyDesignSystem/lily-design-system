import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Blockquote from './Blockquote.vue';

const meta = {
  title: 'Headless/Blockquote',
  component: Blockquote,
  tags: ['autodocs']
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
