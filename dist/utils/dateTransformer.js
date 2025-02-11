export function transformDate(dateStr) {
    if (!dateStr)
        return null;
    try {
        if (dateStr.split(" ").length === 2) {
            const [month, year] = dateStr.split(" ");
            const months = {
                January: "01",
                February: "02",
                March: "03",
                April: "04",
                May: "05",
                June: "06",
                July: "07",
                August: "08",
                September: "09",
                October: "10",
                November: "11",
                December: "12",
            };
            return `${months[month]}/01/${year}`;
        }
        const parts = dateStr.replace(/(?:st|nd|rd|th)/, "").split(" ");
        if (parts.length === 3) {
            const months = {
                January: "01",
                February: "02",
                March: "03",
                April: "04",
                May: "05",
                June: "06",
                July: "07",
                August: "08",
                September: "09",
                October: "10",
                November: "11",
                December: "12",
            };
            const month = months[parts[0]];
            const day = parts[1].padStart(2, "0");
            let year = parts[2].trim();
            if (year.length === 2) {
                year = `20${year}`;
            }
            return `${month}/${day}/${year}`;
        }
        if (dateStr.trim().match(/^\d{2,4}$/)) {
            let year = dateStr.trim();
            if (year.length === 2) {
                year = `20${year}`;
            }
            return `01/01/${year}`;
        }
        const dateMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/);
        if (dateMatch) {
            const [, month, day, year] = dateMatch;
            let fullYear = year;
            if (year.length === 2) {
                fullYear = `20${year}`;
            }
            return `${month}/${day}/${fullYear}`;
        }
        return null;
    }
    catch (error) {
        console.error(`Error parsing date: ${dateStr}`, error);
        return null;
    }
}
