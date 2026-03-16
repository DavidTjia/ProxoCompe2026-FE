export const getPollutionStatus = (value: number) => {
  if (value < 4) return { level: "low", color: "#143416", iconName: "leaf" };
  if (value < 7)
    return { level: "moderate", color: "#F97316", iconName: "leaf" };
  if (value < 9)
    return {
      level: "high",
      color: "#EF4444",
      iconName: "exclamationmark.triangle",
    };
  return {
    level: "critical",
    color: "#cd0000",
    iconName: "exclamationmark.triangle",
  };
};

export const reportPrivacyStatus = {
  PUBLIC: {
    label: "PUBLIC",
    color: "#15803D",
  },
  ONLY_ME: {
    label: "DRAFT",
    color: "#4f4f4f",
  },
};
