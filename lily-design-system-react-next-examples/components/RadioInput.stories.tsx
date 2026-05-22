import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RadioInput from './RadioInput';

const meta = {
  title: 'Examples/RadioInput',
  component: RadioInput,
  tags: ['autodocs']
} satisfies Meta<typeof RadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
