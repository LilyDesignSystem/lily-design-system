import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import KyprosNationalPassportNumberInput from './KyprosNationalPassportNumberInput';

const meta = {
  title: 'Examples/KyprosNationalPassportNumberInput',
  component: KyprosNationalPassportNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof KyprosNationalPassportNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'KyprosNationalPassportNumberInput' }
};
