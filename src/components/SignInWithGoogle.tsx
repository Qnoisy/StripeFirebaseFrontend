import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../firebase/firebase';

export const SignInWithGoogle = () => {
	const navigate = useNavigate();
	const handleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			toast.success('success');
			navigate('/course');
		} catch (error) {
			console.error(error);
			toast.error('check console');
		}
	};

	return (
		<button className='btn primary' onClick={handleSignIn}>
			Sign with Google
		</button>
	);
};
