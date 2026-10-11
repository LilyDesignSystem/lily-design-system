import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TourList from './TourList.vue';

const meta = {
  title: 'Headless/TourList',
  component: TourList,
  tags: ['autodocs']
} satisfies Meta<typeof TourList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
