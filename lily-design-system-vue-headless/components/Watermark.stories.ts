import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Watermark from './Watermark.vue';

const meta = {
  title: 'Headless/Watermark',
  component: Watermark,
  tags: ['autodocs']
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
