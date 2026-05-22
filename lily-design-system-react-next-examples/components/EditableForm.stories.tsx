import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EditableForm from './EditableForm';

const meta = {
  title: 'Examples/EditableForm',
  component: EditableForm,
  tags: ['autodocs']
} satisfies Meta<typeof EditableForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
