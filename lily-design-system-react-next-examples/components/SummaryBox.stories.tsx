import type { Meta, StoryObj } from '@storybook/react-vite';
import SummaryBox from './SummaryBox';

const meta = {
  title: 'Headless/SummaryBox',
  component: SummaryBox,
  tags: ['autodocs']
} satisfies Meta<typeof SummaryBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
