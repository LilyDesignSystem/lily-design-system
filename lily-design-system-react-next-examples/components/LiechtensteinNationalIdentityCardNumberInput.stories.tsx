import type { Meta, StoryObj } from '@storybook/react-vite';
import LiechtensteinNationalIdentityCardNumberInput from './LiechtensteinNationalIdentityCardNumberInput';

const meta = {
  title: 'Headless/LiechtensteinNationalIdentityCardNumberInput',
  component: LiechtensteinNationalIdentityCardNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof LiechtensteinNationalIdentityCardNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LiechtensteinNationalIdentityCardNumberInput' }
};
