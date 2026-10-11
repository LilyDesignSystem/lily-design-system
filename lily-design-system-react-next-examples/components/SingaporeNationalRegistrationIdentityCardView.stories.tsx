import type { Meta, StoryObj } from '@storybook/react-vite';
import SingaporeNationalRegistrationIdentityCardView from './SingaporeNationalRegistrationIdentityCardView';

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
