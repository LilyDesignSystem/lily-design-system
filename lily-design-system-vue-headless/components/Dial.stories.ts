import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Dial from './Dial.vue';

const meta = {
  title: 'Headless/Dial',
  component: Dial,
  tags: ['autodocs']
} satisfies Meta<typeof Dial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
