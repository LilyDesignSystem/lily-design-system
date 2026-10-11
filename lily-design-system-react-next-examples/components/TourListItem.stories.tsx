import type { Meta, StoryObj } from '@storybook/react-vite';
import TourListItem from './TourListItem';

const meta = {
  title: 'Headless/TourListItem',
  component: TourListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TourListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
