import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TourListItem from './TourListItem.vue';

const meta = {
  title: 'Headless/TourListItem',
  component: TourListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TourListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
