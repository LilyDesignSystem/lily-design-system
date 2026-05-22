import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TextAreaInput from './TextAreaInput';

const meta = {
  title: 'Examples/TextAreaInput',
  component: TextAreaInput,
  tags: ['autodocs']
} satisfies Meta<typeof TextAreaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
