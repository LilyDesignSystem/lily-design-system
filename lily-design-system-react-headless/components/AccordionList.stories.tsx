import type { Meta, StoryObj } from '@storybook/react-vite';
import AccordionList from './AccordionList';

const meta = {
  title: 'Headless/AccordionList',
  component: AccordionList,
  tags: ['autodocs']
} satisfies Meta<typeof AccordionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
