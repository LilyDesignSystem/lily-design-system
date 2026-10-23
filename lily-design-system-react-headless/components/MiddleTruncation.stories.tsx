import type { Meta, StoryObj } from '@storybook/react-vite';
import MiddleTruncation from './MiddleTruncation';

const meta = {
  title: 'Headless/MiddleTruncation',
  component: MiddleTruncation,
  tags: ['autodocs']
} satisfies Meta<typeof MiddleTruncation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { text: 'quarterly-report-final-version-3.pdf', ellipsis: '…', strategy: 'min-end', end: 6 } };
