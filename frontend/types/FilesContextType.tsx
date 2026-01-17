import { Dispatch, SetStateAction } from "react";

export type FileMap = Record<string, { code: string; active?: boolean; hidden?: boolean }>;

export interface FilesContextType {
    files: FileMap;
    setFiles: Dispatch<SetStateAction<FileMap>>;
}

export const initialFilesContext: FilesContextType = {
    files: {},
    setFiles: () => {},
};