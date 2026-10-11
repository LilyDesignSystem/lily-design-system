import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Command from './Command.vue';

const meta = {
  title: 'Headless/Command',
  component: Command,
  tags: ['autodocs']
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
