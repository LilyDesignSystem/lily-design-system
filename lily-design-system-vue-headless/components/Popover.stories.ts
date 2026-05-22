import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Popover from './Popover.vue';

const meta = {
  title: 'Headless/Popover',
  component: Popover,
  tags: ['autodocs']
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
