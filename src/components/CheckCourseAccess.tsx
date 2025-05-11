import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import auth from '../firebase/firebase';

export const CheckCourseAccess = () => {
	const [access, setAccess] = useState<boolean | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
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
					console.error('Ошибка проверки доступа:', err);
					setError('Ошибка при проверке доступа');
				}
			} else {
				setAccess(false);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: 'red' }}>{error}</p>;

	return (
		<div>
			{access === null ? (
				<p>Unable to determine access</p>
			) : access ? (
				<p>You have access to the course! 🎉</p>
			) : (
				<p>Access to the course is not available</p>
			)}
		</div>
	);
};
