import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<form class=\"newsletter-signup\" aria-label=\"\" x-data=\"lilyNewsletterSignup()\" x-bind=\"form\">\n  <header class=\"newsletter-signup-header\">\n    <h3 class=\"newsletter-signup-heading\"><!-- Consumer provides heading text (optional) --></h3>\n    <p class=\"newsletter-signup-description\"><!-- Consumer provides description text (optional) --></p>\n  </header>\n  <label class=\"newsletter-signup-label\">\n    <!-- Consumer provides email label text -->\n    <input type=\"email\" class=\"newsletter-signup-email\" placeholder=\"\" x-bind=\"field\">\n  </label>\n  <button type=\"submit\" class=\"newsletter-signup-submit\" x-bind=\"submit\"><!-- Consumer provides submit button text --></button>\n  <p class=\"newsletter-signup-success\" role=\"status\" aria-live=\"polite\" hidden x-bind=\"success\"><!-- Consumer provides success message text --></p>\n  <p class=\"newsletter-signup-error\" role=\"alert\" hidden x-bind=\"error\"><!-- Consumer provides error message text --></p>\n</form>";

const meta = {
  title: 'Headless/Newsletter Signup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
