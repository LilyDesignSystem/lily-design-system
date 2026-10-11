import type { Meta, StoryObj } from '@storybook/react-vite';
import TextAreaInput from './TextAreaInput';

const meta = {
  title: 'Headless/TextAreaInput',
  component: TextAreaInput,
  tags: ['autodocs']
} satisfies Meta<typeof TextAreaInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
