import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setCronURL, storePersist } from "@/lib/valtio";
import { http } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSnapshot } from "valtio";
export const Route = createFileRoute("/_layout/cron-api")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Cron API Setting",
			},
		],
	}),
});

function RouteComponent() {
	const { cronURL: cronUrl } = useSnapshot(storePersist);
	const [url, setUrl] = useState(cronUrl);
	return (
		<div className="flex flex-col items-center justify-center gap-3 min-h-[calc(100vh-200px)]">
			<Input
				className="w-80"
				placeholder="https://192.168.123.7:8000"
				value={url}
				onChange={(e) => {
					setUrl(e.target.value);
				}}
			/>
			<Button
				className="cursor-pointer"
				onClick={() => {
					http(`${url}/ping`, { errorMessage: "添加失败" })
						.then((data) => {
							if (data == "pong") {
								setCronURL(url);
								toast.success("添加成功");
							} else {
								toast.error("添加失败");
							}
						})
						.catch(() => {
							setCronURL(cronUrl);
						});
				}}
			>
				添加Cron后端地址
			</Button>
		</div>
	);
}
