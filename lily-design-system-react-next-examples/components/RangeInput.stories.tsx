import type { Meta, StoryObj } from '@storybook/react-vite';
import RangeInput from './RangeInput';

const meta = {
  title: 'Headless/RangeInput',
  component: RangeInput,
  tags: ['autodocs']
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
