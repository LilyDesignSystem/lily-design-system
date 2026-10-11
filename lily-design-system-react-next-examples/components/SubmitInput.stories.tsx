import type { Meta, StoryObj } from '@storybook/react-vite';
import SubmitInput from './SubmitInput';

const meta = {
  title: 'Headless/SubmitInput',
  component: SubmitInput,
  tags: ['autodocs']
} satisfies Meta<typeof SubmitInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
