import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import auth from '../firebase/firebase';

// Загружаем Stripe с публичным ключом из .env
const stripePromise = loadStripe(
	process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ''
);

export const BuyButton = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
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
			alert('Сначала войдите через Google');
			return;
		}

		try {
			const stripe = await stripePromise;
			if (!stripe) {
				setError('Stripe не загрузился');
				return;
			}
			const token = await user.getIdToken();

			const res = await axios.post(
				'http://localhost:3001/create-checkout-session',
				{
					priceId: 'price_1RH8xz08ggOZUDPt028GAGR7',
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const sessionUrl = res.data.url;
			window.location.href = sessionUrl;

			if (sessionUrl.url) {
				window.location.href = sessionUrl.url;
			} else {
				setError('Не удалось получить ссылку на оплату');
			}
		} catch (err) {
			console.error(err);
			setError('Ошибка при создании сессии оплаты');
		}
	};

	if (loading) return <p>Загрузка...</p>;

	return (
		<div>
			<button onClick={handleBuy} disabled={!user}>
				Купить курс
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};
