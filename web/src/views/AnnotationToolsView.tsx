import { PiSelectionPlus } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";
import { AnnotationTool } from "@/types";

type Props = {
	currentAnnotationTool: AnnotationTool
	setCurrentAnnotationTool: (arg0: AnnotationTool) => void
}

export default function AnnotationToolsView({ currentAnnotationTool, setCurrentAnnotationTool }: Props) {
	return (
		<div className="w-full h-full flex flex-col p-5">
			<div className="flex-[10] flex flex-col justify-center items-center">
				<div className="w-full h-full flex-1 flex justify-center items-center p-1">
					<button className={`bg-zinc-500 p-1 rounded-l-md border hover:bg-zinc-600 hover:shadow-2xl active:scale-95 ${currentAnnotationTool == AnnotationTool.Selection ? 'text-blue-400' : ''}`}
							onClick={async () => { setCurrentAnnotationTool(AnnotationTool.Selection); } }>
						<PiSelectionPlus size={30} />
					</button>
					<button className={`bg-zinc-500 p-1 rounded-r-md border hover:bg-zinc-600 hover:shadow-2xl active:scale-95 ${currentAnnotationTool == AnnotationTool.Delete ? 'text-blue-400' : ''}`}
							onClick={async () => { setCurrentAnnotationTool(AnnotationTool.Delete); } }>
						<FaTrashAlt size={30} />
					</button>
				</div>
				<hr className="w-full"/>
				<div className="w-full flex-[10] flex justify-start items-center">
					
				</div>
			</div>
			<hr className="w-full" />
			<div className="flex-1 flex justify-center items-center">
				<button className="bg-zinc-500 w-full py-3 rounded-md hover:bg-zinc-600 hover:shadow-2xl active:scale-95 ease-linear transition-all">
					New Class
				</button>
			</div>
		</div>
	)
}