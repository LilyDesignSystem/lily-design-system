import type { Meta, StoryObj } from '@storybook/react-vite';
import ResetInput from './ResetInput';

const meta = {
  title: 'Headless/ResetInput',
  component: ResetInput,
  tags: ['autodocs']
} satisfies Meta<typeof ResetInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
