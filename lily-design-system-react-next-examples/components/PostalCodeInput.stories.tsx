import type { Meta, StoryObj } from '@storybook/react-vite';
import PostalCodeInput from './PostalCodeInput';

const meta = {
  title: 'Headless/PostalCodeInput',
  component: PostalCodeInput,
  tags: ['autodocs']
} satisfies Meta<typeof PostalCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
