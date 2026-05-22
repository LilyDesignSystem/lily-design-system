import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmailInput from './EmailInput';

const meta = {
  title: 'Examples/EmailInput',
  component: EmailInput,
  tags: ['autodocs']
} satisfies Meta<typeof EmailInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
