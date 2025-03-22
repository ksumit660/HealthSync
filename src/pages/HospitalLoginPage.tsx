import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import HospitalLoginForm from '../components/auth/HospitalLoginForm';

export default function HospitalLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Hospital Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your hospital dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <HospitalLoginForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New Hospital?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/hospital-signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register your Hospital
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/contact"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
