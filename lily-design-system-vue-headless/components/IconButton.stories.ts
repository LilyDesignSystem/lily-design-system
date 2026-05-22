import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconButton from './IconButton.vue';

const meta = {
  title: 'Headless/IconButton',
  component: IconButton,
  tags: ['autodocs']
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
