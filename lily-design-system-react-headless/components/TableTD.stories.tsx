import type { Meta, StoryObj } from '@storybook/react-vite';
import TableTD from './TableTD';

const meta = {
  title: 'Headless/TableTD',
  component: TableTD,
  tags: ['autodocs']
} satisfies Meta<typeof TableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
