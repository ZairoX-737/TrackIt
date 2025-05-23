'use client';
import { useState, useEffect } from 'react';
import { AuthService } from '../api';
import { User } from '../api/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const checkAuth = async () => {
		try {
			const token = Cookies.get('accessToken');
			if (!token) {
				setLoading(false);
				return;
			}

			const response = await AuthService.me();
			setUser(response.user);
		} catch (error) {
			console.error('Auth check failed:', error);
			// Если токен недействителен, удаляем его
			Cookies.remove('accessToken');
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			Cookies.remove('accessToken');
			setUser(null);
			router.push('/auth/login');
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return {
		user,
		loading,
		logout,
		isAuthenticated: !!user,
	};
};
