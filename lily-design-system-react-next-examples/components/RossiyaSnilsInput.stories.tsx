import type { Meta, StoryObj } from '@storybook/react-vite';
import RossiyaSnilsInput from './RossiyaSnilsInput';

const meta = {
  title: 'Headless/RossiyaSnilsInput',
  component: RossiyaSnilsInput,
  tags: ['autodocs']
} satisfies Meta<typeof RossiyaSnilsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RossiyaSnilsInput' }
};
