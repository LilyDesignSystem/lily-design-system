import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PolskaNumerIdentyfikacjiPodatkowejInput from './PolskaNumerIdentyfikacjiPodatkowejInput';

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
