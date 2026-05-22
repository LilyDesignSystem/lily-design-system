import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StatusTag from './StatusTag.vue';

const meta = {
  title: 'Headless/StatusTag',
  component: StatusTag,
  tags: ['autodocs']
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
