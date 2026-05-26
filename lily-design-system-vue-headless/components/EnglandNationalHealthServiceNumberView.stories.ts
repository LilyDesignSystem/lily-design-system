import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EnglandNationalHealthServiceNumberView from './EnglandNationalHealthServiceNumberView.vue';

const meta = {
  title: 'Headless/EnglandNationalHealthServiceNumberView',
  component: EnglandNationalHealthServiceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof EnglandNationalHealthServiceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EnglandNationalHealthServiceNumberView' }
};
