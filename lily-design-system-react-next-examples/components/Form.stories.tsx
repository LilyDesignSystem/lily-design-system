import type { Meta, StoryObj } from '@storybook/react-vite';
import Form from './Form';

const meta = {
  title: 'Headless/Form',
  component: Form,
  tags: ['autodocs']
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
