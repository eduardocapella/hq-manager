import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function LoginForm() {
	const { signIn, signUp } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (isSignUp) {
			const { error: err } = await signUp(email, password);
			if (err) {
				setError(err.message);
				return;
			}
			setMessage("Check your email to confirm your account, then sign in.");
			return;
		}

		const { error: err } = await signIn(email, password);
		if (err) {
			setError(err.message);
		}
	}

	return (
		<div className="login-form">
			<h2>HQ Manager</h2>
			<p>Sign in to save your collection in the cloud.</p>
			<p className="login-hint">
				First time? Click <strong>“Create an account”</strong> below, then fill the form and click Sign up.
			</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
				/>
				<label htmlFor="password">Password</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					autoComplete={isSignUp ? "new-password" : "current-password"}
					minLength={6}
				/>
				{error && <p className="login-error" role="alert">{error}</p>}
				{message && <p className="login-message">{message}</p>}
				<button type="submit">
					{isSignUp ? "Sign up" : "Sign in"}
				</button>
				<button
					type="button"
					className="login-toggle"
					onClick={() => {
						setIsSignUp((prev) => !prev);
						setError(null);
						setMessage(null);
					}}
				>
					{isSignUp ? "Already have an account? Sign in" : "Create an account"}
				</button>
			</form>
		</div>
	);
}
