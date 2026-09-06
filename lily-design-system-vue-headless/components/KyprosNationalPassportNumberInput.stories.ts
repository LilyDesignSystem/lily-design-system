import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KyprosNationalPassportNumberInput from './KyprosNationalPassportNumberInput.vue';

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
