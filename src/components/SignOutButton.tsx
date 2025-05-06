import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import auth from '../firebase/firebase';

export const SignOutButton = () => {
	const navigate = useNavigate();
	const handleSignOut = () => {
		signOut(auth);
		navigate('/signIn');
	};

	return (
		<button className='btn secondary' onClick={handleSignOut}>
			Выйти
		</button>
	);
};
