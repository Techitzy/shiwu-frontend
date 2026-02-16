// utils.js

/**
 * Formats a date string into a readable format: "23 Dec 2024".
 * @param {string} dateString - The date string to format.
 * @returns {string} - Formatted date string.
 */
export const formatDate = dateString => {
  const options = {day: '2-digit', month: 'short', year: 'numeric'};
  const formattedDate = new Date(dateString).toLocaleDateString(
    'en-GB',
    options,
  );
  return formattedDate;
};

/**
 * Formats a time string into a readable format: "6:30 PM".
 * @param {string} dateString - The date string to extract and format time.
 * @returns {string} - Formatted time string.
 */
export const formatTime = dateString => {
  const utcDate = new Date(dateString);

  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000,
  );
  const options = {hour: 'numeric', minute: 'numeric', hour12: true};
  const formattedTime = localDate.toLocaleTimeString('en-US', options);

  return formattedTime;
};
