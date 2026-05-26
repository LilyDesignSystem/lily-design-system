import type { Meta, StoryObj } from '@storybook/react-vite';
import HrvatskaOsobniIdentifikacijskiBrojView from './HrvatskaOsobniIdentifikacijskiBrojView';

const meta = {
  title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojView',
  component: HrvatskaOsobniIdentifikacijskiBrojView,
  tags: ['autodocs']
} satisfies Meta<typeof HrvatskaOsobniIdentifikacijskiBrojView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HrvatskaOsobniIdentifikacijskiBrojView' }
};
