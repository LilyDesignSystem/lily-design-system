import type { Meta, StoryObj } from '@storybook/react-vite';
import LiechtensteinNationalIdentityCardNumberView from './LiechtensteinNationalIdentityCardNumberView';

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
