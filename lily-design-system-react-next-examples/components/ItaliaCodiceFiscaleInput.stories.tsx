import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ItaliaCodiceFiscaleInput from './ItaliaCodiceFiscaleInput';

const meta = {
  title: 'Examples/ItaliaCodiceFiscaleInput',
  component: ItaliaCodiceFiscaleInput,
  tags: ['autodocs']
} satisfies Meta<typeof ItaliaCodiceFiscaleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ItaliaCodiceFiscaleInput' }
};
