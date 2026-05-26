import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LiechtensteinNationalIdentityCardNumberView from './LiechtensteinNationalIdentityCardNumberView.vue';

const meta = {
  title: 'Headless/LiechtensteinNationalIdentityCardNumberView',
  component: LiechtensteinNationalIdentityCardNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof LiechtensteinNationalIdentityCardNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LiechtensteinNationalIdentityCardNumberView' }
};
