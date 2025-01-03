import { AnnotatedImage, AnnotationTool, TrainFile } from "@/types";
import AnnotateImageView from "@/views/AnnotateImageView";
import AnnotationToolsView from "@/views/AnnotationToolsView";
import { useEffect, useState } from "react";

export default function Home() {

	const [currentTrainFile, setCurrentTrainFile] = useState<TrainFile>({ 
		filePath: null, 
		classes: [], 
		images: [] 
	})
	const [currentAnnotatedImage, setCurrentAnnotatedImage] = useState<AnnotatedImage | null>(null)
	const [currentAnnotationTool, setCurrentAnnotationTool] = useState<AnnotationTool>(AnnotationTool.Selection)

    useEffect(() => {
        currentTrainFile.images.push({ filePath: `C:/Users/nikon/OneDrive/Desktop/sandbox/LabelGUI/MSI_MAG.jpg`, annotations: [] })
		setCurrentTrainFile(structuredClone(currentTrainFile))
        setCurrentAnnotatedImage(currentTrainFile.images.at(0)!)
    }, [])

  return (
    <div className="w-screen h-screen flex flex-row">
        <div className="flex-1 border border-blue-400">

        </div>
        <div className="flex-[5] border border-blue-400">
            <AnnotateImageView currentAnnotatedImage={currentAnnotatedImage!} currentAnnotationTool={currentAnnotationTool}/>
        </div>
        <div className="flex-1 border border-blue-400">
            <AnnotationToolsView currentAnnotationTool={currentAnnotationTool} setCurrentAnnotationTool={setCurrentAnnotationTool}/>
        </div>
    </div>
  );
}
