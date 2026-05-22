import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Editable from './Editable';

const meta = {
  title: 'Examples/Editable',
  component: Editable,
  tags: ['autodocs']
} satisfies Meta<typeof Editable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
