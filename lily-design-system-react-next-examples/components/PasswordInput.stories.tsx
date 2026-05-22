import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PasswordInput from './PasswordInput';

const meta = {
  title: 'Examples/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs']
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
