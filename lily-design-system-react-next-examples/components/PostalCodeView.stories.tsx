import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PostalCodeView from './PostalCodeView';

const meta = {
  title: 'Examples/PostalCodeView',
  component: PostalCodeView,
  tags: ['autodocs']
} satisfies Meta<typeof PostalCodeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
