import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FloatButton from './FloatButton';

const meta = {
  title: 'Examples/FloatButton',
  component: FloatButton,
  tags: ['autodocs']
} satisfies Meta<typeof FloatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
