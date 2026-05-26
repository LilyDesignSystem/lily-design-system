import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CymruRhifYGwasanaethIechydGwladolView from './CymruRhifYGwasanaethIechydGwladolView.vue';

const meta = {
  title: 'Headless/CymruRhifYGwasanaethIechydGwladolView',
  component: CymruRhifYGwasanaethIechydGwladolView,
  tags: ['autodocs']
} satisfies Meta<typeof CymruRhifYGwasanaethIechydGwladolView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CymruRhifYGwasanaethIechydGwladolView' }
};
