import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ValidationListItem from './ValidationListItem.vue';

const meta = {
  title: 'Headless/ValidationListItem',
  component: ValidationListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ValidationListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
