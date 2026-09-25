import type { Meta, StoryObj } from '@storybook/react-vite';
import SingaporeNationalRegistrationIdentityCardInput from './SingaporeNationalRegistrationIdentityCardInput';

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
