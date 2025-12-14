import { useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";

import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";

interface DebouncedInputProps {
	onChange: (value: string) => void;
	delay?: number;
}

type Props = DebouncedInputProps &
	Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export const DebouncedInput = (props: Props) => {
	const { className, placeholder, delay, onChange } = { ...props };
	const [value, setValue] = useState("");
	const [debouncedValue] = useDebounce<string>(value, delay || 500);

	const fnRef = useRef(onChange);

	useEffect(() => {
		fnRef.current.call(undefined, debouncedValue);
	}, [debouncedValue]);

	return (
		<Input
			placeholder={placeholder}
			className={className}
			value={value}
			// onClick={e => (e.target as HTMLDivElement).focus()}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
};
