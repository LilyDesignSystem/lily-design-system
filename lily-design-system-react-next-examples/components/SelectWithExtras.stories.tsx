import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SelectWithExtras from './SelectWithExtras';

const meta = {
  title: 'Examples/SelectWithExtras',
  component: SelectWithExtras,
  tags: ['autodocs']
} satisfies Meta<typeof SelectWithExtras>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
