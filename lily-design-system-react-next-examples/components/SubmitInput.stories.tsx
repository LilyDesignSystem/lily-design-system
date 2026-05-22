import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SubmitInput from './SubmitInput';

const meta = {
  title: 'Examples/SubmitInput',
  component: SubmitInput,
  tags: ['autodocs']
} satisfies Meta<typeof SubmitInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
