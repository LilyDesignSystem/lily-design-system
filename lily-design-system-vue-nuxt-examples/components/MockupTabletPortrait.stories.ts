import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MockupTabletPortrait from './MockupTabletPortrait.vue';

const meta = {
  title: 'Headless/MockupTabletPortrait',
  component: MockupTabletPortrait,
  tags: ['autodocs']
} satisfies Meta<typeof MockupTabletPortrait>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
