import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import auth from '../firebase/firebase';

const stripePromise = loadStripe(
	process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''
);

export const BuyButton = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const handleBuy = async () => {
		if (!user) {
			toast.error('Please sign in with Google first.');
			return;
		}

		try {
			const stripe = await stripePromise;
			if (!stripe) {
				setError('Stripe did not load');
				return;
			}

			const token = await user.getIdToken();
			const res = await axios.post(
				'http://localhost:5000/api/create-checkout-session',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (res.data.url) {
				window.location.href = res.data.url;
			} else {
				setError('Failed to get payment link');
			}
		} catch (err) {
			console.error('Error creating payment session:', err);
			setError('Error creating payment session');
		}
	};

	if (loading) return <p>Loading...</p>;

	return (
		<div>
			<button onClick={handleBuy} disabled={!user}>
				Buy course
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};
