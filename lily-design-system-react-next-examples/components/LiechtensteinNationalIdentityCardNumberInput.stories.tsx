import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LiechtensteinNationalIdentityCardNumberInput from './LiechtensteinNationalIdentityCardNumberInput';

const meta = {
  title: 'Examples/LiechtensteinNationalIdentityCardNumberInput',
  component: LiechtensteinNationalIdentityCardNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof LiechtensteinNationalIdentityCardNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LiechtensteinNationalIdentityCardNumberInput' }
};
