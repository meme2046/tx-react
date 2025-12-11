import { Button } from "@/components/ui/button";
import ButtonTest from "@/tests/ButtonTest";
import { Link } from "react-router";
import { Outlet } from "react-router";
export default function Test() {
	return (
		<div className="p-4 space-y-4">
			<h2 className="text-xl font-semibold">Test Page</h2>
			<p>This is the test page in React Router v7 Framework mode.</p>
			<div className="space-x-1">
				<Button asChild>
					<Link to="/">Go Home</Link>
				</Button>
				<ButtonTest />
			</div>

			<main>
				<Outlet /> {/* 子路由内容将在这里渲染 */}
			</main>
		</div>
	);
}
