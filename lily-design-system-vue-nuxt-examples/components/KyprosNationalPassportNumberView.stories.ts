import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KyprosNationalPassportNumberView from './KyprosNationalPassportNumberView.vue';

const meta = {
  title: 'Headless/KyprosNationalPassportNumberView',
  component: KyprosNationalPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof KyprosNationalPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'KyprosNationalPassportNumberView' }
};
