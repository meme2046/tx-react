import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Outlet } from "@tanstack/react-router";

function App() {
	return (
		<>
			<div className="flex gap-4 justify-center">
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<div className="h-96 bg-accent">
				<Outlet />
			</div>
		</>
	);
}

export default App;
