import type { Meta, StoryObj } from '@storybook/react-vite';
import KyprosNationalPassportNumberInput from './KyprosNationalPassportNumberInput';

const meta = {
  title: 'Headless/KyprosNationalPassportNumberInput',
  component: KyprosNationalPassportNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof KyprosNationalPassportNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'KyprosNationalPassportNumberInput' }
};
