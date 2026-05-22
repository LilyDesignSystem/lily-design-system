import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Listbox from './Listbox';

const meta = {
  title: 'Examples/Listbox',
  component: Listbox,
  tags: ['autodocs']
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
