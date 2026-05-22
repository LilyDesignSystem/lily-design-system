import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Visible from './Visible.vue';

const meta = {
  title: 'Headless/Visible',
  component: Visible,
  tags: ['autodocs']
} satisfies Meta<typeof Visible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
