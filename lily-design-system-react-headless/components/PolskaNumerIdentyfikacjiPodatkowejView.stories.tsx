import type { Meta, StoryObj } from '@storybook/react-vite';
import PolskaNumerIdentyfikacjiPodatkowejView from './PolskaNumerIdentyfikacjiPodatkowejView';

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
