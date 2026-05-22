import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TableFoot from './TableFoot';

const meta = {
  title: 'Examples/TableFoot',
  component: TableFoot,
  tags: ['autodocs']
} satisfies Meta<typeof TableFoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
