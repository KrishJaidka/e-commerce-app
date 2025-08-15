import HomePage from './components/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { DarkModeProvider } from './contexts/DarkModeContext';

function App() {
  return (
    <DarkModeProvider>
      <CartProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </CartProvider>
    </DarkModeProvider>
  );
}

export default App;
