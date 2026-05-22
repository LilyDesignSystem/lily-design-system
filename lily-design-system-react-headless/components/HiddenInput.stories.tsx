import type { Meta, StoryObj } from '@storybook/react-vite';
import HiddenInput from './HiddenInput';

const meta = {
  title: 'Headless/HiddenInput',
  component: HiddenInput,
  tags: ['autodocs']
} satisfies Meta<typeof HiddenInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
