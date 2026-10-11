import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AccordionNav from './AccordionNav.vue';

const meta = {
  title: 'Headless/AccordionNav',
  component: AccordionNav,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
