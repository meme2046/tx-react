import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import { upperFirst } from "lodash";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { storePersist } from "@/lib/valtio";
import type { IEtcd } from "@/types";

export function SaveJob(props: {
	name?: string;
	title: string;
	triggerContent?: ReactNode;
	size?: "default" | "sm" | "lg" | "icon" | null;
	variant?:
		| "default"
		| "link"
		| "outline"
		| "secondary"
		| "ghost"
		| "destructive"
		| null;
}) {
	const queryClient = useQueryClient();
	const { cronURL } = useSnapshot(storePersist);
	const { name, title, triggerContent, size, variant } = { ...props };
	const [state, setState] = useState({
		name: "",
		command: "",
		cronExpr: "",
		sortIndex: 0,
	});

	const saveJob = async () => {
		return await http(`${cronURL}/api/v1/etcd`, {
			successMessage: "Job saved successfully.",
			errorMessage: undefined,
			method: "put",
			data: { key: `/cron/jobs/${state.name}`, value: { ...state } },
		});
	};

	const handleInputChange =
		(field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			if (field === "sortIndex") {
				setState({ ...state, [field]: Number(e.target.value) });
			} else {
				setState({ ...state, [field]: e.target.value });
			}
		};

	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button
								size={size}
								variant={variant}
								className="cursor-pointer"
								onClick={() => {
									setState({
										name: "",
										command: "",
										cronExpr: "",
										sortIndex: 0,
									});
									if (name) {
										http<IEtcd>(`${cronURL}/api/v1/etcd`, {
											params: {
												key: `/cron/jobs/${name}`,
												prefix: false,
											},
										}).then((resp) => {
											setState({
												sortIndex: 0,
												...JSON.parse(resp.value),
											});
										});
									}
								}}
							>
								{triggerContent}
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>
							{title} {name} job
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>{upperFirst(title)} job</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div>
						<Label htmlFor="jobName">Job name</Label>
						<Input
							id="jobName"
							value={state.name}
							onChange={handleInputChange("name")}
						/>
					</div>
					<div>
						<Label htmlFor="command">Command</Label>
						<Input
							id="command"
							value={state.command}
							onChange={handleInputChange("command")}
						/>
					</div>
					<div>
						<Label htmlFor="cronExpr">Cron Expression</Label>
						<Input
							id="cronExpr"
							value={state.cronExpr}
							onChange={handleInputChange("cronExpr")}
						/>
					</div>
					<div>
						<Label htmlFor="sortIndex">Sort inex</Label>
						<Input
							id="sortIndex"
							value={state.sortIndex ?? 0}
							onChange={handleInputChange("sortIndex")}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={() => {
							saveJob().then(() => {
								queryClient.invalidateQueries({
									queryKey: ["cron-job"],
								});
								setOpen(false);
							});
						}}
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
