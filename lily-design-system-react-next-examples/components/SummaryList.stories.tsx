import type { Meta, StoryObj } from '@storybook/react-vite';
import SummaryList from './SummaryList';

const meta = {
  title: 'Headless/SummaryList',
  component: SummaryList,
  tags: ['autodocs']
} satisfies Meta<typeof SummaryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
