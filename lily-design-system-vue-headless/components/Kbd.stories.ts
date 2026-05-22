import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Kbd from './Kbd.vue';

const meta = {
  title: 'Headless/Kbd',
  component: Kbd,
  tags: ['autodocs']
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
