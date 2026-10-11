import type { Meta, StoryObj } from '@storybook/react-vite';
import LiechtensteinPassportNumberInput from './LiechtensteinPassportNumberInput';

const meta = {
  title: 'Headless/LiechtensteinPassportNumberInput',
  component: LiechtensteinPassportNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof LiechtensteinPassportNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LiechtensteinPassportNumberInput' }
};
