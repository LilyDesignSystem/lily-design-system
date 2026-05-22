import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Form from './Form';

const meta = {
  title: 'Examples/Form',
  component: Form,
  tags: ['autodocs']
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
