import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableTD from './DataTableTD';

const meta = {
  title: 'Headless/DataTableTD',
  component: DataTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableTD>;

export default meta;
type Story = StoryObj<typeof DataTableTD>;

export const Default: Story = {};
