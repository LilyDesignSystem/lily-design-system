import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SingaporeNationalRegistrationIdentityCardInput from './SingaporeNationalRegistrationIdentityCardInput.vue';

const meta = {
  title: 'Headless/SingaporeNationalRegistrationIdentityCardInput',
  component: SingaporeNationalRegistrationIdentityCardInput,
  tags: ['autodocs']
} satisfies Meta<typeof SingaporeNationalRegistrationIdentityCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SingaporeNationalRegistrationIdentityCardInput' }
};
