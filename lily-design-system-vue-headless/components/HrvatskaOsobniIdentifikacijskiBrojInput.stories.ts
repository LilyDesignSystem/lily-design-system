import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HrvatskaOsobniIdentifikacijskiBrojInput from './HrvatskaOsobniIdentifikacijskiBrojInput.vue';

const meta = {
  title: 'Headless/HrvatskaOsobniIdentifikacijskiBrojInput',
  component: HrvatskaOsobniIdentifikacijskiBrojInput,
  tags: ['autodocs']
} satisfies Meta<typeof HrvatskaOsobniIdentifikacijskiBrojInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HrvatskaOsobniIdentifikacijskiBrojInput' }
};
