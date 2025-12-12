import { mapValues, get } from "lodash"


const colorKeyMap: Record<string, string> = {
    "50": "900",
    "100": "800",
    "200": "700",
    "300": "600",
    "400": "500",
    "500": "400",
    "600": "300",
    "700": "200",
    "800": "100",
    "900": "50",
    "DEFAULT": "DEFAULT",
    "foreground": "foreground",
}

interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    foreground?: string;
    DEFAULT?: string;
}

const customizingColors: Record<string, ColorScale> = {
    "emerald": {
        50: "#ECFDF5",
        100: "#D1FAE5",
        200: "#A7F3D0",
        300: "#6EE7B7",
        400: "#34D399",
        500: "#10B981",
        600: "#059669",
        700: "#047857",
        800: "#065F46",
        900: "#064E3B",
    },
    "teal": {
        50: "#F0FDFA",
        100: "#CCFBF1",
        200: "#99F6E4",
        300: "#5EEAD4",
        400: "#2DD4BF",
        500: "#14B8A6",
        600: "#0D9488",
        700: "#0F766E",
        800: "#115E59",
        900: "#134E4A",
    },
    "cyan": {
        50: "#ECFEFF",
        100: "#CFFAFE",
        200: "#A5F3FC",
        300: "#67E8F9",
        400: "#22D3EE",
        500: "#06B6D4",
        600: "#0891B2",
        700: "#0E7490",
        800: "#155E75",
        900: "#164E63",
    },
    "sky": {
        50: "#F0F9FF",
        100: "#E0F2FE",
        200: "#BAE6FD",
        300: "#7DD3FC",
        400: "#38BDF8",
        500: "#0EA5E9",
        600: "#0284C7",
        700: "#0369A1",
        800: "#075985",
        900: "#0C4A6E",
    },
    "orange": {
        50: "#FFF7ED",
        100: "#FFEDD5",
        200: "#FED7AA",
        300: "#FDBA74",
        400: "#FB923C",
        500: "#F97316",
        600: "#EA580C",
        700: "#C2410C",
        800: "#9A3412",
        900: "#7C2D12",
    },
    "rose": {
        50: "#FFF1F2",
        100: "#FFE4E6",
        200: "#FECDD3",
        300: "#FDA4AF",
        400: "#FB7185",
        500: "#F43F5E",
        600: "#E11D48",
        700: "#BE123C",
        800: "#9F1239",
        900: "#881337",
    },
    "pink": {
        50: "#FDF2F8",
        100: "#FCE7F3",
        200: "#FBCFE8",
        300: "#F9A8D4",
        400: "#F472B6",
        500: "#EC4899",
        600: "#DB2777",
        700: "#BE185D",
        800: "#9D174D",
        900: "#831843",
    },
    "indigo": {
        50: "#EEF2FF",
        100: "#E0E7FF",
        200: "#C7D2FE",
        300: "#A5B4FC",
        400: "#818CF8",
        500: "#6366F1",
        600: "#4F46E5",
        700: "#4338CA",
        800: "#3730A3",
        900: "#312E81",
    },
    "violet": {
        50: "#F5F3FF",
        100: "#EDE9FE",
        200: "#DDD6FE",
        300: "#C4B5FD",
        400: "#A78BFA",
        500: "#8B5CF6",
        600: "#7C3AED",
        700: "#6D28D9",
        800: "#5B21B6",
        900: "#4C1D95",
    },
    "purple": {
        50: "#FAF5FF",
        100: "#F3E8FF",
        200: "#E9D5FF",
        300: "#D8B4FE",
        400: "#C084FC",
        500: "#A855F7",
        600: "#9333EA",
        700: "#7E22CE",
        800: "#6B21A8",
        900: "#581C87",
    },
    "fuchsia": {
        50: "#FDF4FF",
        100: "#FAE8FF",
        200: "#F5D0FE",
        300: "#F0ABFC",
        400: "#E879F9",
        500: "#D946EF",
        600: "#C026D3",
        700: "#A21CAF",
        800: "#86198F",
        900: "#701A75",
    },
    "lime": {
        50: "#F7FEE7",
        100: "#ECFCCB",
        200: "#D9F99D",
        300: "#BEF264",
        400: "#A3E635",
        500: "#84CC16",
        600: "#65A30D",
        700: "#4D7C0F",
        800: "#3F6212",
        900: "#365314",
    },
    "blue": {
        50: "#EFF6FF",
        100: "#DBEAFE",
        200: "#BFDBFE",
        300: "#93C5FD",
        400: "#60A5FA",
        500: "#3B82F6",
        600: "#2563EB",
        700: "#1D4ED8",
        800: "#1E40AF",
        900: "#1E3A8A",
    },
    "yellow": {
        50: "#FEFCE8",
        100: "#FEF9C3",
        200: "#FEF08A",
        300: "#FDE047",
        400: "#FACC15",
        500: "#EAB308",
        600: "#CA8A04",
        700: "#A16207",
        800: "#854D0E",
        900: "#713F12",
    },
}

export const getColorScale = (key: string, defaultKey: number, isDark: boolean = false) => {
    const obj: ColorScale = customizingColors[key]
    obj.DEFAULT = get(obj, defaultKey)
    if (isDark) {
        return mapValues(obj, (_: never, k: string | number) => {
            return get(obj, colorKeyMap[k])
        })
    }

    return obj
}