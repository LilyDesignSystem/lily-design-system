import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CanadaSocialInsuranceNumberView from './CanadaSocialInsuranceNumberView.vue';

const meta = {
  title: 'Headless/CanadaSocialInsuranceNumberView',
  component: CanadaSocialInsuranceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof CanadaSocialInsuranceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CanadaSocialInsuranceNumberView' }
};
