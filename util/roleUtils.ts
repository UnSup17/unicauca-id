export const getColorsForRole = (role: string) => {
  const normalizedRole = role.toUpperCase().trim();

  switch (normalizedRole) {
    case "CONTRATISTA":
      return {
        roleColor: "#6BCECE",
        borderColor: "#04B0B3",
        surnameColor: "#04B0B3",
        tableColor: "#04B0B3",
        nameColor: "#001382",
        tableTextColor: "#001382",
      };
    case "TRABAJADORA OFICIAL":
      return {
        roleColor: "#7883BA",
        borderColor: "#27306B",
        surnameColor: "#27306B",
        tableColor: "#27306B",
        nameColor: "#001382",
        tableTextColor: "#001382",
      };
    case "ADMINISTRATIVO":
      return {
        roleColor: "#8D8ACE",
        borderColor: "#46378C",
        surnameColor: "#46378C",
        tableColor: "#46378C",
        nameColor: "#001382",
        tableTextColor: "#001382",
      };
    case "PROFESORES":
      return {
        roleColor: "#AD5C5C",
        borderColor: "#AB1917",
        surnameColor: "#AB1917",
        tableColor: "#AB1917",
        nameColor: "#001382",
        tableTextColor: "#001382",
      };
    case "EGRESADOS":
      return {
        roleColor: "#40519F",
        borderColor: "#27316C",
        nameColor: "#27316C",
        tableTextColor: "#27316C",
        tableColor: "#40519F",
        surnameColor: "#40519F",
      };
    case "ESTUDIANTES":
      return {
        roleColor: "#88CFE5",
        borderColor: "#1DA6DF",
        surnameColor: "#1DA6DF",
        tableColor: "#1DA6DF",
        nameColor: "#001382",
        tableTextColor: "#001382",
      };
    default:
      // Default fallback (using existing default colors from styles)
      return {
        roleColor: "#88CFE5",
        borderColor: "#1DA6DF",
        surnameColor: "#1DA6DF",
        tableColor: "#1DA6DF",
        nameColor: "#001382",
        tableTextColor: "#001382",
      };
  }
};

export const parseRoles = (rolesString: string | undefined): string[] => {
  if (!rolesString) return [];
  return (
    rolesString
      .replace("[", "")
      .replace("]", "")
      .replace(" ", "")
      .split(",")
      // The original code reversed the array, preserving that behavior
      .reverse()
  );
};
