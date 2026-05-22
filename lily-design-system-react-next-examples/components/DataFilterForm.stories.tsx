import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataFilterForm from './DataFilterForm';

const meta = {
  title: 'Examples/DataFilterForm',
  component: DataFilterForm,
  tags: ['autodocs']
} satisfies Meta<typeof DataFilterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
