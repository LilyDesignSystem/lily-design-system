import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckboxInput from './CheckboxInput';

const meta = {
  title: 'Examples/CheckboxInput',
  component: CheckboxInput,
  tags: ['autodocs']
} satisfies Meta<typeof CheckboxInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
