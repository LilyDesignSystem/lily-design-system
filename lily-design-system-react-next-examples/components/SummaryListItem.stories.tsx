import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SummaryListItem from './SummaryListItem';

const meta = {
  title: 'Examples/SummaryListItem',
  component: SummaryListItem,
  tags: ['autodocs']
} satisfies Meta<typeof SummaryListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
