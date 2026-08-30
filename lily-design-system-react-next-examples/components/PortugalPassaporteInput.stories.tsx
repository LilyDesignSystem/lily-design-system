import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PortugalPassaporteInput from './PortugalPassaporteInput';

const meta = {
  title: 'Examples/PortugalPassaporteInput',
  component: PortugalPassaporteInput,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalPassaporteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalPassaporteInput' }
};
