interface BoxProps {
	children: React.ReactNode
	className?: string
}

export function Box({ children, className }: BoxProps) {
	return <div>{children}</div>
}
