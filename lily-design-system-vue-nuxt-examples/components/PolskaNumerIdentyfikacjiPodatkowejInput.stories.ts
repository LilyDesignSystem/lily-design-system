import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PolskaNumerIdentyfikacjiPodatkowejInput from './PolskaNumerIdentyfikacjiPodatkowejInput.vue';

const meta = {
  title: 'Examples/PolskaNumerIdentyfikacjiPodatkowejInput',
  component: PolskaNumerIdentyfikacjiPodatkowejInput,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaNumerIdentyfikacjiPodatkowejInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaNumerIdentyfikacjiPodatkowejInput' }
};
