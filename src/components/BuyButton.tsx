import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import auth from '../firebase/firebase';

const stripePromise = loadStripe(
	process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''
);

export const BuyButton = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [access, setAccess] = useState<boolean | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			setUser(user);
			setLoading(false);

			if (user) {
				try {
					const token = await user.getIdToken();
					const res = await axios.post(
						'http://localhost:5000/api/check-access',
						{},
						{
							headers: {
								Authorization: `Bearer ${token}`,
								'Content-Type': 'application/json',
							},
						}
					);
					setAccess(res.data.access);
				} catch (err) {
					console.error('Error checking access:', err);
				}
			}
		});

		return () => unsubscribe();
	}, []);

	const handleBuy = async () => {
		if (!user) {
			setError('Please sign in first.');
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
			}
		} catch (err: any) {
			console.error('Error creating payment session:', err);
			const errorMessage =
				err.response?.data?.error || 'Error creating payment session';
			setError(errorMessage);
		}
	};

	if (loading) return <p>Loading...</p>;

	return (
		<div>
			{access ? (
				<div className='bg-green-100 p-4 rounded-md'>
					<p>You already own this course.</p>
				</div>
			) : (
				<button onClick={handleBuy} disabled={!user}>
					Buy Course
				</button>
			)}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};
