import type { Meta, StoryObj } from '@storybook/react-vite';
import PortugalPassaporteInput from './PortugalPassaporteInput';

const meta = {
  title: 'Headless/PortugalPassaporteInput',
  component: PortugalPassaporteInput,
  tags: ['autodocs']
} satisfies Meta<typeof PortugalPassaporteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PortugalPassaporteInput' }
};
