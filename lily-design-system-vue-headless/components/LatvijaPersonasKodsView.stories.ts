import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LatvijaPersonasKodsView from './LatvijaPersonasKodsView.vue';

const meta = {
  title: 'Headless/LatvijaPersonasKodsView',
  component: LatvijaPersonasKodsView,
  tags: ['autodocs']
} satisfies Meta<typeof LatvijaPersonasKodsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LatvijaPersonasKodsView' }
};
