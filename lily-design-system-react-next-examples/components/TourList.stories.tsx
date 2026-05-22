import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TourList from './TourList';

const meta = {
  title: 'Examples/TourList',
  component: TourList,
  tags: ['autodocs']
} satisfies Meta<typeof TourList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
