import { format } from "date-fns";

export const formatDate = (date: Date | string | number) => {
    return format(new Date(date), "MMM dd, yyyy");
};
