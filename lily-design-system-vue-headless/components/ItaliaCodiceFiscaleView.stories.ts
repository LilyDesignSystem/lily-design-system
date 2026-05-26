import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ItaliaCodiceFiscaleView from './ItaliaCodiceFiscaleView.vue';

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
