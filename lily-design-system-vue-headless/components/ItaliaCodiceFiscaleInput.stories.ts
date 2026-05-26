import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ItaliaCodiceFiscaleInput from './ItaliaCodiceFiscaleInput.vue';

const meta = {
  title: 'Headless/ItaliaCodiceFiscaleInput',
  component: ItaliaCodiceFiscaleInput,
  tags: ['autodocs']
} satisfies Meta<typeof ItaliaCodiceFiscaleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ItaliaCodiceFiscaleInput' }
};
