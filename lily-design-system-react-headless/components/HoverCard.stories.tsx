import type { Meta, StoryObj } from '@storybook/react-vite';
import HoverCard from './HoverCard';

const meta = {
  title: 'Headless/HoverCard',
  component: HoverCard,
  tags: ['autodocs']
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
