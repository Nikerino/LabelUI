import { AnnotatedImage, Annotation, AnnotationTool } from "@/types"
import { useEffect, useRef, useState } from "react"

type Props = {
	currentAnnotatedImage: AnnotatedImage,
	currentAnnotationTool: AnnotationTool
}

export default function AnnotateImageView({ currentAnnotatedImage, currentAnnotationTool }: Props) {

	const [displayImage, setDisplayImage] = useState<HTMLImageElement | null>(null)
	const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null)
	const [highlightedAnnotation, setHighlightedAnnotation] = useState<Annotation | null>(null)

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const contextRef = useRef<CanvasRenderingContext2D>(null)

	useEffect(() => {
		const canvas = canvasRef.current!
		const ctx = canvas.getContext('2d')!
		contextRef.current = ctx

		fetch('/image/load', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'file_path': currentAnnotatedImage?.filePath
			})
		})
		.then(async (response) => {
			if (response.ok) {
				const data = await response.json()
				const newImage = new Image()
				newImage.src = `data:image;base64,${data.image}`
				setDisplayImage(newImage)
				const canvas = canvasRef.current!
				canvas.width = newImage.width
				canvas.height = newImage.height
			}
		})
	}, [currentAnnotatedImage])

	useEffect(() => {
		const canvas = canvasRef.current!
		const ctx = contextRef.current!
				
		if (displayImage) {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(displayImage, 0, 0)

			ctx.strokeStyle = 'red'

			if (currentAnnotation) {
				ctx.lineWidth = 10
				ctx.strokeRect(currentAnnotation.x, currentAnnotation.y, currentAnnotation.width, currentAnnotation.height)
			}

			if (currentAnnotatedImage) {
				currentAnnotatedImage.annotations.forEach((annotation) => {
					ctx.lineWidth = annotation == highlightedAnnotation ? 15 : 10
					ctx.lineCap = annotation == highlightedAnnotation ? 'square' : 'butt'
					ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height)
				})
			}
		}
	}, [displayImage, currentAnnotation, highlightedAnnotation, currentAnnotatedImage])

	async function getNearestAnnotation(e: MouseEvent): Promise<Annotation | null> {
		const { x, y } = await getMousePosition(e)
		const xThresh = displayImage!.width * 0.05
		const yThresh = displayImage!.height * 0.05

		let nearestAnnotation: Annotation | null = null
		let minDistance: number = Number.MAX_VALUE
		currentAnnotatedImage.annotations.forEach((annotation) => {
			const distanceTop = Math.abs(y - annotation.y)
			const distanceBottom = Math.abs(y - (annotation.y + annotation.height))
			const distanceLeft = Math.abs(x - annotation.x)
			const distanceRight = Math.abs(x - (annotation.x + annotation.width))
			if ((distanceBottom < yThresh || distanceTop < yThresh) && (distanceLeft < xThresh || distanceRight < xThresh)) {
				if (distanceTop < minDistance) {
					minDistance = distanceTop
					nearestAnnotation = annotation
				}
				if (distanceBottom < minDistance) {
					minDistance = distanceBottom
					nearestAnnotation = annotation
				}
				if (distanceLeft < minDistance) {
					minDistance = distanceLeft
					nearestAnnotation = annotation
				}
				if (distanceRight < minDistance) {
					minDistance = distanceRight
					nearestAnnotation = annotation
				}
			}
		})
		return nearestAnnotation
	}

	async function getMousePosition(e: MouseEvent) {
		const canvas = canvasRef.current!
		const widthScale = canvas.width / canvas.offsetWidth
		const heightScale = canvas.height / canvas.offsetHeight
		const x = (e.clientX - canvas.offsetLeft) * widthScale
		const y = (e.clientY - canvas.offsetTop) * heightScale
		return { x: x, y: y }
	}

	async function beginAnnotation(e: MouseEvent) {
		if (!currentAnnotation) {
			const { x, y } = await getMousePosition(e)
			setCurrentAnnotation({
				class: null,
				x: x,
				y: y,
				width: 0,
				height: 0,
			})
		}
	}

	async function endAnnotation(e: MouseEvent) {
		if (currentAnnotation) {
			currentAnnotatedImage!.annotations.push(currentAnnotation)
			setCurrentAnnotation(null)
		}
	}

	async function moveAnnotation(e: MouseEvent) {
		if (currentAnnotation) {
			const { x, y } = await getMousePosition(e)
			currentAnnotation.width = x - currentAnnotation.x
			currentAnnotation.height = y - currentAnnotation.y
			setCurrentAnnotation(structuredClone(currentAnnotation))
		}
	}

	async function deleteAnnotation(e: MouseEvent) {
		const nearestAnnotation = await getNearestAnnotation(e)
		currentAnnotatedImage.annotations = currentAnnotatedImage.annotations.filter((annotation) => annotation != nearestAnnotation)
		
	}

	async function highlightAnnotation(e: MouseEvent) {
		const nearestAnnotation = await getNearestAnnotation(e)
		setHighlightedAnnotation(nearestAnnotation)
	}

	async function handleMouseDown(e: MouseEvent) {
		e.preventDefault()
		e.stopPropagation()

		switch (currentAnnotationTool) {
			case AnnotationTool.Selection:
				await beginAnnotation(e)
				break
			case AnnotationTool.Delete:
				await deleteAnnotation(e)
				break
		}
	}
	
	async function handleMouseUp(e: MouseEvent) {
		switch (currentAnnotationTool) {
			case AnnotationTool.Selection:
				await endAnnotation(e)
				break
		}
	}

	async function handleMouseMove(e: MouseEvent) {
		switch (currentAnnotationTool) {
			case AnnotationTool.Selection:
				await moveAnnotation(e)
				break
			case AnnotationTool.Delete:
				await highlightAnnotation(e)
				break
		}
	}

	return (
		<div className="w-full h-full flex justify-center items-center p-10">
			<div className="flex justify-center items-center bg-zinc-600 rounded-lg p-10">
				<canvas ref={canvasRef} className={"max-h-full max-w-full"}
						onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}/>
			</div>
		</div>
	)
}