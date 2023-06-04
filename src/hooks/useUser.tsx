import {
	useUser as useSupaUser,
	useSessionContext,
	User
} from '@supabase/auth-helpers-react'
import { createContext, useContext, useEffect, useState } from 'react'
import { Subscription, UserDetails } from '../../types'

type UserContextType = {
	accessToken: string | null
	user: User | null
	userDetails: UserDetails | null
	isLoading: boolean
	subscription: Subscription | null
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface MyUserContextProviderProps {
	[propName: string]: any
}

export function MyUserContextProvider(props: MyUserContextProviderProps) {
	const {
		session,
		isLoading: isLoadingUser,
		supabaseClient: supabase
	} = useSessionContext()
	const user = useSupaUser()
	const accessToken = session?.access_token ?? null
	const [isLoadingData, setIsloadingData] = useState(false)
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
	const [subscription, setSubscription] = useState<Subscription | null>(null)
	useEffect(() => {
		function getUserDetails() {
			return supabase.from('users').select('*').single()
		}

		function getSubscription() {
			return supabase
				.from('subscriptions')
				.select('*, prices(*, products(*))')
				.in('status', ['trialing', 'active'])
				.single()
		}

		if (user && !isLoadingData && !userDetails && !subscription) {
			setIsloadingData(true)
			Promise.allSettled([getUserDetails(), getSubscription()]).then(
				results => {
					const userDetailsPromise = results[0]
					const subscriptionPromise = results[1]
					if (userDetailsPromise.status === 'fulfilled')
						setUserDetails(
							userDetailsPromise.value.data as UserDetails
						)
					if (subscriptionPromise.status === 'fulfilled')
						setSubscription(
							subscriptionPromise.value.data as Subscription
						)
					setIsloadingData(false)
				}
			)
		} else if (!user && !isLoadingUser && !isLoadingData) {
			setUserDetails(null)
			setSubscription(null)
		}
	}, [
		isLoadingData,
		isLoadingUser,
		subscription,
		supabase,
		user,
		userDetails
	])
	const value = {
		accessToken,
		user,
		userDetails,
		isLoading: isLoadingUser || isLoadingData,
		subscription
	}
	return <UserContext.Provider value={value} {...props} />
}

export function useUser() {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useUser must be used within a MyUserContextProvider.')
	}
	return context
}
