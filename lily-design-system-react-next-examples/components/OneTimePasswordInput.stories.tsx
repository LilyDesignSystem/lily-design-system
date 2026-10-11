import type { Meta, StoryObj } from '@storybook/react-vite';
import OneTimePasswordInput from './OneTimePasswordInput';

const meta = {
  title: 'Headless/OneTimePasswordInput',
  component: OneTimePasswordInput,
  tags: ['autodocs']
} satisfies Meta<typeof OneTimePasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Verification code", length: 6 }
};
