import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ItaliaCodiceFiscaleView from './ItaliaCodiceFiscaleView';

const meta = {
  title: 'Examples/ItaliaCodiceFiscaleView',
  component: ItaliaCodiceFiscaleView,
  tags: ['autodocs']
} satisfies Meta<typeof ItaliaCodiceFiscaleView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ItaliaCodiceFiscaleView' }
};
