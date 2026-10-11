import type { Meta, StoryObj } from '@storybook/react-vite';
import PolskaPeselView from './PolskaPeselView';

const meta = {
  title: 'Headless/PolskaPeselView',
  component: PolskaPeselView,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaPeselView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaPeselView' }
};
