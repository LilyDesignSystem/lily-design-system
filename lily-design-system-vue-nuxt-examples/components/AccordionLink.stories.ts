import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AccordionLink from './AccordionLink.vue';

const meta = {
  title: 'Headless/AccordionLink',
  component: AccordionLink,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
