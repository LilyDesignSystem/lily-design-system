import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LiechtensteinNationalIdentityCardNumberInput from './LiechtensteinNationalIdentityCardNumberInput.vue';

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
