import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Card from './Card.vue';

const meta = {
  title: 'Headless/Card',
  component: Card,
  tags: ['autodocs']
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
