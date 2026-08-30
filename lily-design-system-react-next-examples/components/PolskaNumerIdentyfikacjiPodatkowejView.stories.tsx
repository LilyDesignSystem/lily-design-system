import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PolskaNumerIdentyfikacjiPodatkowejView from './PolskaNumerIdentyfikacjiPodatkowejView';

const meta = {
  title: 'Examples/PolskaNumerIdentyfikacjiPodatkowejView',
  component: PolskaNumerIdentyfikacjiPodatkowejView,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaNumerIdentyfikacjiPodatkowejView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaNumerIdentyfikacjiPodatkowejView' }
};
