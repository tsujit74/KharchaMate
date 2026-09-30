export const getDateRanges = (period, startDate, endDate) => {
  const now = new Date();

  switch (period) {
    case "THIS_WEEK": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;

      const start = new Date(now);
      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      return { start, end };
    }

    case "THIS_MONTH": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);

      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      return { start, end };
    }

    case "LAST_MONTH": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const end = new Date(now.getFullYear(), now.getMonth(), 1);

      return { start, end };
    }

    case "LAST_3_MONTHS": {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);

      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      return { start, end };
    }

    case "THIS_YEAR": {
      const start = new Date(now.getFullYear(), 0, 1);

      const end = new Date(now.getFullYear() + 1, 0, 1);

      return { start, end };
    }

    case "CUSTOM": {
      if (!startDate || !endDate) {
        throw new Error("INVALID_CUSTOM_RANGE");
      }

      const start = new Date(`${startDate}T00:00:00`);
      const end = new Date(`${endDate}T00:00:00`);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("INVALID_CUSTOM_RANGE");
      }

      if (start >= end) {
        throw new Error("INVALID_CUSTOM_RANGE");
      }

      end.setDate(end.getDate() + 1);

      return { start, end };
    }

    case "ALL_TIME":
      return null;

    default:
      throw new Error("INVALID_PERIOD");
  }
};
