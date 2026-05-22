import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Combobox from './Combobox';

const meta = {
  title: 'Examples/Combobox',
  component: Combobox,
  tags: ['autodocs']
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
