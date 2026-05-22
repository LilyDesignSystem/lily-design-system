import type { Meta, StoryObj } from '@storybook/react-vite';
import TableTH from './TableTH';

const meta = {
  title: 'Headless/TableTH',
  component: TableTH,
  tags: ['autodocs']
} satisfies Meta<typeof TableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
