import { FC } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { BuyButton } from './components/BuyButton';
import { SignInWithGoogle } from './components/SignInWithGoogle';
import { SignOutButton } from './components/SignOutButton';

interface RouteInterface {
	path: string;
	component: FC;
}

const publicRoutes: RouteInterface[] = [
	// { path: '*', component: BuyButton },
	{ path: '/course', component: BuyButton },
	{ path: '/signOut', component: SignOutButton },
	{ path: '/signIn', component: SignInWithGoogle },
];
export const App = () => {
	const navigate = useNavigate();
	return (
		<div>
			<ul className='app__list'>
				{publicRoutes.map((route, index) => (
					<button
						key={index}
						className='app__link'
						onClick={() => navigate(route.path)}
					>
						<span className='app__link--text'>{route.component.name}</span>
					</button>
				))}
			</ul>

			<Routes>
				{publicRoutes.map((route, index) => (
					<Route key={index} path={route.path} element={<route.component />} />
				))}
			</Routes>
			<h1>Пример Stripe + Firebase</h1>
		</div>
	);
};
