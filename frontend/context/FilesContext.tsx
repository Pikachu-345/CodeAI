import { createContext } from "react";
import { FilesContextType, initialFilesContext } from "@/types/FilesContextType";

export const FilesContext = createContext<FilesContextType>(initialFilesContext);