import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PostalCodeInput from './PostalCodeInput';

const meta = {
  title: 'Examples/PostalCodeInput',
  component: PostalCodeInput,
  tags: ['autodocs']
} satisfies Meta<typeof PostalCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
