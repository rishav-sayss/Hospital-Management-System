 import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute tak data "fresh" maana jaayega, dobara request nahi jaayegi
      refetchOnWindowFocus: false, // tab badalne par bar-bar API call na ho
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  
  <QueryClientProvider client={queryClient}>
         <App />
  </QueryClientProvider>
    
 
)
