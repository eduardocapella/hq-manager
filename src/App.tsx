import { useState } from "react";

import "./App.css";

function App() {
	const totalHQs = 75;
	const [purchasedHQs, setPurchasedHQs] = useState<number[]>([]);
	// plain JavaScript would be:
	// const [purchasedHQs, setPurchasedHQs] = useState([]);
	const purchasedHQsTotal = purchasedHQs.length;

	const editionNumbers = Array.from({ length: totalHQs }, (_, i) => i + 1);

	function handleToggle(editionNumber: number) {
		if (purchasedHQs.includes(editionNumber)) {
			setPurchasedHQs(purchasedHQs.filter((n) => n !== editionNumber));
		} else {
			setPurchasedHQs([...purchasedHQs, editionNumber]);
		}
	}

	return (
		<>
			<header>
				<h1>"The Savage Sword of Conan" - HQ Manager</h1>
				<p>Total HQs: {totalHQs}</p>
				<p>Purchased HQs: {purchasedHQsTotal}</p>
			</header>

			<main>
				<h2>HQs</h2>
				<ul className="grid">
					{editionNumbers.map((editionNumber) => (
						<li key={editionNumber} className="hq">
							<button
								type="button"
								className={`hq-button ${purchasedHQs.includes(editionNumber) ? "selected" : ""}`}
								onClick={() => handleToggle(editionNumber)}
							>
								{editionNumber}
							</button>
						</li>
					))}
				</ul>
			</main>
		</>
	);
}

export default App;
