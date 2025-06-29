import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import Navbar from '../components/Navbar';
import { useUserStore } from '../stores/useUserStore.js';


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Use selectors for zustand reactivity
  const user = useUserStore((state) => state.user);
  const signup = useUserStore((state) => state.signup);
  const loading = useUserStore((state) => state.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Calling here bro")
    signup(formData);
console.log("Submitted data:", formData);

  }
  
  return (

    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen overflow-auto'>
      <div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{opacity: 0, y:20}}
      animate={{opacity: 1, y:0}}
      transition={{duration: 0.8, delay:0.2}}>

      <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>
        Create your account
      </h2>
      </div>

      <div
      className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      initial={{opacity: 0, y:20}}
      animate={{opacity: 1, y:0}}
      transition={{duration: 0.8, delay:0.2}}>

      <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Full Name
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input 
              id='name'
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value})}
              className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500
              ' placeholder="Asim Ali"
               />
            </div>
          </div>
          <div>
            <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Email
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input 
              id='email'
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value})}
              className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
              placeholder='example@gmail.com' />
            </div>
          </div>
          <div>
            <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
              Password
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input 
              id='password'
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value})}
              className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500
              ' placeholder='.........'
               />
            </div>
            <label htmlFor="name" className='block text-sm font-medium text-gray-300 mt-4'>
              Confirm Password
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
              <input 
              id='confirmPassword'
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value})}
              className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500
              ' placeholder='.........'
               />
            </div>
          </div>

          <button className='w-full flex justify-center py-2 px-4 border border-transparent
          rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
          focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-emerald-500 transition duration-150 ease-in-out
          disabled:opacity-50'>
            {loading ? (
              <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
              Loading...
              </>
            ) : (
              <>
              <UserPlus className='mr-2 h-5 w-5' aria-hidden />
              Sign up
              </>
            )}
          </button>
        </form>

        <p className='mt-8 text-center text-sm text-gray-400'>
         Already have an account? {" "}
         <Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
         Login here <ArrowRight className='inline h-4 w-4' />
         </Link>
        </p>

      </div>
      </div>

    </div>
   )
  
}

export default SignUpPage