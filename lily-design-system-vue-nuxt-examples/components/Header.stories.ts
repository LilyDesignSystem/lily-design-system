import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Header from './Header.vue';

const meta = {
  title: 'Examples/Header',
  component: Header,
  tags: ['autodocs']
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
