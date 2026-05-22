import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="date-time-now-input"
  role="group"
  aria-label=""
  data-date-label="Date"
  data-time-label="Time"
  data-now-label="Now"
>
  <!-- Consumer provides content via JavaScript initialization -->
</div>

<script>
  // DateTimeNowInput behavior
  (function() {
    'use strict';
    document.querySelectorAll('.date-time-now-input').forEach(function(el) {
      var dateLabel = el.getAttribute('data-date-label') || 'Date';
      var timeLabel = el.getAttribute('data-time-label') || 'Time';
      var nowLabel = el.getAttribute('data-now-label') || 'Now';

      // Create date input
      var dateInput = el.querySelector('input[type="date"]');
      if (!dateInput) {
        dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.setAttribute('aria-label', dateLabel);
        el.appendChild(dateInput);
      }

      // Create time input
      var timeInput = el.querySelector('input[type="time"]');
      if (!timeInput) {
        timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.setAttribute('aria-label', timeLabel);
        el.appendChild(timeInput);
      }

      // Create "Now" button
      var nowButton = el.querySelector('button');
      if (!nowButton) {
        nowButton = document.createElement('button');
        nowButton.type = 'button';
        nowButton.setAttribute('aria-label', nowLabel);
        nowButton.textContent = nowLabel;
        el.appendChild(nowButton);
      }

      // "Now" button click handler
      nowButton.addEventListener('click', function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        dateInput.value = year + '-' + month + '-' + day;
        timeInput.value = hours + ':' + minutes;
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        timeInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/DateTimeNowInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
