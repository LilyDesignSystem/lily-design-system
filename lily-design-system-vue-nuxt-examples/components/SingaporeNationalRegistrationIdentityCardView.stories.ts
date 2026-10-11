import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SingaporeNationalRegistrationIdentityCardView from './SingaporeNationalRegistrationIdentityCardView.vue';

const meta = {
  title: 'Headless/SingaporeNationalRegistrationIdentityCardView',
  component: SingaporeNationalRegistrationIdentityCardView,
  tags: ['autodocs']
} satisfies Meta<typeof SingaporeNationalRegistrationIdentityCardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SingaporeNationalRegistrationIdentityCardView' }
};
