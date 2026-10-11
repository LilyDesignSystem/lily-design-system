import type { Meta, StoryObj } from '@storybook/react-vite';
import Listbox from './Listbox';

const meta = {
  title: 'Headless/Listbox',
  component: Listbox,
  tags: ['autodocs']
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
