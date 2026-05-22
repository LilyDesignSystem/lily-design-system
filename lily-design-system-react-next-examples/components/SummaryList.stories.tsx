import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SummaryList from './SummaryList';

const meta = {
  title: 'Examples/SummaryList',
  component: SummaryList,
  tags: ['autodocs']
} satisfies Meta<typeof SummaryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
