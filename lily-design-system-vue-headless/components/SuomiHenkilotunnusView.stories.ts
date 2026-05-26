import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SuomiHenkilotunnusView from './SuomiHenkilotunnusView.vue';

const meta = {
  title: 'Headless/SuomiHenkilotunnusView',
  component: SuomiHenkilotunnusView,
  tags: ['autodocs']
} satisfies Meta<typeof SuomiHenkilotunnusView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SuomiHenkilotunnusView' }
};
