import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MockupWindow from './MockupWindow.vue';

const meta = {
  title: 'Headless/MockupWindow',
  component: MockupWindow,
  tags: ['autodocs']
} satisfies Meta<typeof MockupWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
