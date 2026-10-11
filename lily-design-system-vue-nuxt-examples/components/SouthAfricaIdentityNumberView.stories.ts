import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SouthAfricaIdentityNumberView from './SouthAfricaIdentityNumberView.vue';

const meta = {
  title: 'Headless/SouthAfricaIdentityNumberView',
  component: SouthAfricaIdentityNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof SouthAfricaIdentityNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SouthAfricaIdentityNumberView' }
};
