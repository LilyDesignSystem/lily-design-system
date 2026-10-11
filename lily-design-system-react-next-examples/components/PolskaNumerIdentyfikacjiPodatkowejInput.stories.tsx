import type { Meta, StoryObj } from '@storybook/react-vite';
import PolskaNumerIdentyfikacjiPodatkowejInput from './PolskaNumerIdentyfikacjiPodatkowejInput';

const meta = {
  title: 'Headless/PolskaNumerIdentyfikacjiPodatkowejInput',
  component: PolskaNumerIdentyfikacjiPodatkowejInput,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaNumerIdentyfikacjiPodatkowejInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaNumerIdentyfikacjiPodatkowejInput' }
};
