import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Маршруты, которые требуют аутентификации
const protectedRoutes = ['/tasks', '/profile', '/projects'];

// Маршруты для неаутентифицированных пользователей
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('accessToken')?.value;

	// Проверяем, является ли маршрут защищенным
	const isProtectedRoute = protectedRoutes.some(route =>
		pathname.startsWith(route)
	);

	// Проверяем, является ли маршрут для аутентификации
	const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

	// Если пользователь не аутентифицирован и пытается получить доступ к защищенному маршруту
	if (isProtectedRoute && !token) {
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}

	// Если пользователь аутентифицирован и пытается получить доступ к страницам аутентификации
	if (isAuthRoute && token) {
		return NextResponse.redirect(new URL('/tasks', request.url));
	}

	// Перенаправляем с корня на tasks, если пользователь аутентифицирован
	if (pathname === '/' && token) {
		return NextResponse.redirect(new URL('/tasks', request.url));
	}

	// Перенаправляем с корня на страницу входа, если пользователь не аутентифицирован
	if (pathname === '/' && !token) {
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Применяем middleware ко всем маршрутам, кроме:
		 * - api routes
		 * - _next/static (статические файлы)
		 * - _next/image (оптимизация изображений)
		 * - favicon.ico
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
