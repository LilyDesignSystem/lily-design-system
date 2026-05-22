import type { Meta, StoryObj } from '@storybook/react-vite';
import DataFilterForm from './DataFilterForm';

const meta = {
  title: 'Headless/DataFilterForm',
  component: DataFilterForm,
  tags: ['autodocs']
} satisfies Meta<typeof DataFilterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
