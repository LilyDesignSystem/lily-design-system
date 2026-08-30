import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HrvatskaOsobniIdentifikacijskiBrojInput from './HrvatskaOsobniIdentifikacijskiBrojInput';

const meta = {
  title: 'Examples/HrvatskaOsobniIdentifikacijskiBrojInput',
  component: HrvatskaOsobniIdentifikacijskiBrojInput,
  tags: ['autodocs']
} satisfies Meta<typeof HrvatskaOsobniIdentifikacijskiBrojInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HrvatskaOsobniIdentifikacijskiBrojInput' }
};
