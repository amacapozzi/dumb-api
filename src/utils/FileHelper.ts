export type FileType = "GUI" | "CLI" | "RESOURCE";

export const getFileName = (type: FileType, fileName?: string) => {
  switch (type) {
    case "CLI":
      return "cli.exe";
    case "GUI":
      return "gui.exe";
    case "RESOURCE":
      return fileName;
    default:
      return "cli.exe";
  }
};
