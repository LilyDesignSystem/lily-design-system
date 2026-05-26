import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PortugalPassaporteInput from './PortugalPassaporteInput.vue';

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
