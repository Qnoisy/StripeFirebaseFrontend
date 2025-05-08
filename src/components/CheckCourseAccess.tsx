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
						'http://localhost:5000/check-access',
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
				// Если пользователь не авторизован, сразу ставим доступ в false
				setAccess(false);
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p style={{ color: 'red' }}>{error}</p>;

	return (
		<div>
			{access === null ? (
				<p>Не удалось определить доступ</p>
			) : access ? (
				<p>У вас есть доступ к курсу! 🎉</p>
			) : (
				<p>Доступ к курсу отсутствует.</p>
			)}
		</div>
	);
};
