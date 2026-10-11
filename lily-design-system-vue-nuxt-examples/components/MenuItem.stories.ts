import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MenuItem from './MenuItem.vue';

const meta = {
  title: 'Headless/MenuItem',
  component: MenuItem,
  tags: ['autodocs']
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
