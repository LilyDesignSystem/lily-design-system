import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PolskaNumerIdentyfikacjiPodatkowejView from './PolskaNumerIdentyfikacjiPodatkowejView.vue';

const meta = {
  title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejView',
  component: PolskaNumerIdentyfikacjiPodatkowejView,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaNumerIdentyfikacjiPodatkowejView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaNumerIdentyfikacjiPodatkowejView' }
};
