import type { Meta, StoryObj } from '@storybook/react-vite';
import EditableForm from './EditableForm';

const meta = {
  title: 'Headless/EditableForm',
  component: EditableForm,
  tags: ['autodocs']
} satisfies Meta<typeof EditableForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
