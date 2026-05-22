import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HoverCard from './HoverCard.vue';

const meta = {
  title: 'Headless/HoverCard',
  component: HoverCard,
  tags: ['autodocs']
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
