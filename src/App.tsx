import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { supabase } from "./lib/supabase";
import "./App.css";

function App() {
	const { user, session, loading, signOut } = useAuth();
	const totalHQs = 75;
	const [purchasedHQs, setPurchasedHQs] = useState<number[]>([]);
	const [loadingCollection, setLoadingCollection] = useState(true);

	const editionNumbers = Array.from({ length: totalHQs }, (_, i) => i + 1);

	// Load collection from Supabase when user is logged in.
	useEffect(() => {
		if (!user) {
			setLoadingCollection(false);
			return;
		}

		const userId = user.id;

		async function load() {
			const { data, error } = await supabase
				.from("hq_collection")
				.select("purchased_editions")
				.eq("user_id", userId)
				.maybeSingle();

			if (error) {
				console.error("Error loading collection:", error);
				setLoadingCollection(false);
				return;
			}

			const list = Array.isArray(data?.purchased_editions)
				? data.purchased_editions
				: [];
			setPurchasedHQs(list);
			setLoadingCollection(false);
		}

		load();
	}, [user]);

	async function handleToggle(editionNumber: number) {
		const next = purchasedHQs.includes(editionNumber)
			? purchasedHQs.filter((n) => n !== editionNumber)
			: [...purchasedHQs, editionNumber];

		setPurchasedHQs(next);

		if (!user) return;

		const { error } = await supabase.from("hq_collection").upsert(
			{
				user_id: user.id,
				purchased_editions: next,
			},
			{ onConflict: "user_id" },
		);

		if (error) {
			console.error("Error saving collection:", error);
		}
	}

	if (loading) {
		return <p className="app-loading">Loading…</p>;
	}

	if (!session) {
		return <LoginForm />;
	}

	const purchasedHQsTotal = purchasedHQs.length;

	return (
		<>
			<div className="container">
				<header>
					<h1>"The Savage Sword of Conan" - HQ Manager</h1>
					<p>Total HQs: {totalHQs}</p>
					<p>Purchased HQs: {purchasedHQsTotal}</p>
					<button type="button" className="sign-out" onClick={() => signOut()}>
						Sign out
					</button>
				</header>

				<main>
					<h2>HQs</h2>
					{loadingCollection ? (
						<p>Loading your collection…</p>
					) : (
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
					)}
				</main>
			</div>
		</>
	);
}

export default App;
