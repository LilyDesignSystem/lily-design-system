import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AccordionList from './AccordionList';

const meta = {
  title: 'Examples/AccordionList',
  component: AccordionList,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
