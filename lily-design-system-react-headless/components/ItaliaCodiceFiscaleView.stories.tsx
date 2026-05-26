import type { Meta, StoryObj } from '@storybook/react-vite';
import ItaliaCodiceFiscaleView from './ItaliaCodiceFiscaleView';

const meta = {
  title: 'Headless/ItaliaCodiceFiscaleView',
  component: ItaliaCodiceFiscaleView,
  tags: ['autodocs']
} satisfies Meta<typeof ItaliaCodiceFiscaleView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ItaliaCodiceFiscaleView' }
};
