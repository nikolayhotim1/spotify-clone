'use client'

import { AuthModal } from '@/components/AuthModal'
import { UploadModal } from '@/components/UploadModal'
import { useEffect, useState } from 'react'

// interface ModalProviderProps {
// 	products: ProductWithPrice[]
// }

export function ModalProvider(/*{ products }: ModalProviderProps*/) {
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) {
		return null
	}
	return (
		<>
			<AuthModal />
			{/* <SubscribeModal products={products} /> */}
			<UploadModal />
		</>
	)
}
