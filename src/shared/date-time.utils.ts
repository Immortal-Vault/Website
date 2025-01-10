export const getDateTimeFormatOptions = (language: string, hour12: boolean) => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12,
  };

  return new Intl.DateTimeFormat(language, formatOptions);
};
