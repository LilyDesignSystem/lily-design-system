import type { Meta, StoryObj } from '@storybook/react-vite';
import Table from './Table';

const meta = {
  title: 'Headless/Table',
  component: Table,
  tags: ['autodocs']
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
