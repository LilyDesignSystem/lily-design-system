import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Expander from './Expander.vue';

const meta = {
  title: 'Headless/Expander',
  component: Expander,
  tags: ['autodocs']
} satisfies Meta<typeof Expander>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
