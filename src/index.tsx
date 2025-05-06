import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { App } from './App';
import './common/generall.scss';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<BrowserRouter>
		<ToastContainer
			position='bottom-right'
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick={false}
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme='light'
			transition={Bounce}
		/>
		<App />
	</BrowserRouter>
);
