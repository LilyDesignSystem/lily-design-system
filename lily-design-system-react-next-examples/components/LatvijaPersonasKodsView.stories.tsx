import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LatvijaPersonasKodsView from './LatvijaPersonasKodsView';

const meta = {
  title: 'Examples/LatvijaPersonasKodsView',
  component: LatvijaPersonasKodsView,
  tags: ['autodocs']
} satisfies Meta<typeof LatvijaPersonasKodsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LatvijaPersonasKodsView' }
};
