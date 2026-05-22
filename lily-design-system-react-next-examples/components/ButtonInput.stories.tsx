import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ButtonInput from './ButtonInput';

const meta = {
  title: 'Examples/ButtonInput',
  component: ButtonInput,
  tags: ['autodocs']
} satisfies Meta<typeof ButtonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
