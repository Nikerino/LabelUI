export type TrainFile = {
	filePath: string | null
	classes: Array<AnnotationClass>
	images: Array<AnnotatedImage>
}

export type AnnotatedImage = {
	filePath: string
	annotations: Array<Annotation>
}

export type Annotation = {
	class: AnnotationClass
	x: number
	y: number
	width: number
	height: number
}

export type AnnotationClass = {
	name: string
	color: string
}

export enum AnnotationTool {
	Selection=1,
	Delete=2,
}